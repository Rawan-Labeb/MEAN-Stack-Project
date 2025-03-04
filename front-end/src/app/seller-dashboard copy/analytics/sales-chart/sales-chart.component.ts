import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { OrderService } from '../../services/order.service';
import { AnalyticsData } from '../models/analytics.model';
import { Order } from '../../models/order.model';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AuthServiceService } from '../../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  @ViewChild('productsChart') productsChart!: ElementRef;
  @ViewChild('revenueChart') revenueChart!: ElementRef;
  @ViewChild('salesTrendChart') salesTrendChart!: ElementRef;
  @ViewChild('categoryChart') categoryChart!: ElementRef;

  analytics: AnalyticsData | null = null;
  loading = false;
  error: string | null = null;
  startDate: string;
  endDate: string;
  productSalesData: { name: string; quantity: number; revenue: number }[] = [];
  
  private charts: Chart[] = [];

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Sales',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private orderService: OrderService,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = new Date(today.setMonth(today.getMonth() - 1))
      .toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      this.authService.decodeToken(token).subscribe(decodedToken => {
        if (decodedToken) {
          this.loadAnalytics();
        }
      });
    }
  }

  ngAfterViewInit() {
    // Initialize charts after view is ready
    if (this.analytics) {
      this.initializeCharts();
    }
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;
    this.destroyCharts();

    const token = this.cookieService.get('token');
    if (!token) {
      this.error = 'No authentication token found';
      this.loading = false;
      return;
    }

    this.orderService.getSellerOrders().pipe(
      catchError(error => {
        console.error('Detailed error:', error);
        return of([]);
      })
    ).subscribe({
      next: (orders) => {
        if (orders.length === 0) {
          this.error = 'No orders found for this seller';
          return;
        }
        this.analytics = this.processOrdersData(orders);
        setTimeout(() => {
          this.initializeCharts();
        }, 0);
      },
      error: (err) => {
        this.error = 'Failed to load analytics data';
        console.error('Analytics error:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private processOrdersData(orders: Order[]): AnalyticsData {
    const salesByDate = new Map<string, { amount: number; count: number }>();
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      // Use createdAt instead of date
      const date = new Date(order.createdAt || '').toISOString().split('T')[0];
      const existing = salesByDate.get(date) || { amount: 0, count: 0 };
      salesByDate.set(date, {
        amount: existing.amount + order.totalPrice,
        count: existing.count + 1
      });

      // Process product sales
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Use the helper method instead of directly accessing productId
          const productId = this.getProductId(item);
          
          const existing = productSales.get(productId) || { 
            name: this.getProductName(item), 
            sales: 0, 
            revenue: 0 
          };
          
          productSales.set(productId, {
            name: existing.name,
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity)
          });
        });
      }

      totalRevenue += order.totalPrice;
    });

    return {
      sales: Array.from(salesByDate.entries()).map(([date, data]) => ({
        date,
        amount: data.amount,
        count: data.count
      })),
      topProducts: Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      summary: {
        totalOrders,
        totalRevenue,
        totalSales: orders.reduce((acc, order) => 
          acc + (order.items || []).reduce((sum, item) => sum + item.quantity, 0), 0),
        averageOrderValue: totalRevenue / (totalOrders || 1)  // Prevent division by zero
      }
    };
  }

  private processOrdersForCharts(orders: Order[]): void {
    // Map to track sales data by product
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    // Track daily sales for the chart
    const dailySales = new Map<string, number>();
    
    orders.forEach(order => {
      if (!order.items || !Array.isArray(order.items)) return;
      
      // Process for product sales
      order.items.forEach(item => {
        // Get product ID safely with non-null assertion where needed
        const productId = this.getProductId(item);
        
        // Only process if we have a valid product ID
        if (productId) {
          const existing = productSales.get(productId) || {
            name: this.getProductName(item),
            quantity: 0,
            revenue: 0
          };
          
          existing.quantity += item.quantity;
          existing.revenue += item.quantity * item.price;
          
          productSales.set(productId, {
            ...existing
          });
        }
      });
      
      // Process for daily sales chart
      const orderDate = new Date(order.date || order.createdAt || new Date()).toISOString().split('T')[0];
      const currentDailyTotal = dailySales.get(orderDate) || 0;
      dailySales.set(orderDate, currentDailyTotal + order.totalPrice);
    });
    
    // Convert map to arrays for chart data
    this.productSalesData = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
      
    // Set up daily sales data (last 7 days)
    // Rest of your existing code
  }
  
  // Helper method to safely get product ID
  private getProductId(item: any): string {
    if (item.productId) {
      return item.productId;
    }
    
    if (item.product && typeof item.product === 'object' && item.product._id) {
      return item.product._id;
    }
    
    if (item.subInventoryId && typeof item.subInventoryId === 'object' && 
        item.subInventoryId.product && typeof item.subInventoryId.product === 'object' &&
        item.subInventoryId.product._id) {
      return item.subInventoryId.product._id;
    }
    
    // Generate a fallback ID if none exists
    return `item-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Helper method to get product name
  private getProductName(item: any): string {
    // Check for product name in various places
    if (item.product && typeof item.product === 'object' && item.product.name) {
      return item.product.name;
    }
    
    if (item.subInventoryId && typeof item.subInventoryId === 'object') {
      if (item.subInventoryId.name) {
        return item.subInventoryId.name;
      }
      
      if (item.subInventoryId.product && typeof item.subInventoryId.product === 'object' &&
          item.subInventoryId.product.name) {
        return item.subInventoryId.product.name;
      }
    }
    
    // Fallback names
    return `Product ${this.getProductId(item)}`;
  }

  private initializeCharts(): void {
    if (!this.analytics || !this.salesChart?.nativeElement) {
      console.log('Missing analytics data or chart elements');
      return;
    }

    this.destroyCharts();
    console.log('Initializing charts...');

    // Daily Sales Line Chart
    const salesCtx = this.salesChart.nativeElement.getContext('2d');
    this.charts.push(new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: this.analytics.sales.map(item => item.date),
        datasets: [{
          label: 'Daily Sales ($)',
          data: this.analytics.sales.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Daily Sales Trend' },
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Revenue ($)' }
          }
        }
      }
    }));

    // Top Products Bar Chart
    const productsCtx = this.productsChart.nativeElement.getContext('2d');
    this.charts.push(new Chart(productsCtx, {
      type: 'bar',
      data: {
        labels: this.analytics.topProducts.map(product => product.name),
        datasets: [{
          label: 'Units Sold',
          data: this.analytics.topProducts.map(product => product.sales),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Best Selling Products' },
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Units Sold' }
          }
        }
      }
    }));

    // Revenue Distribution Pie Chart
    const revenueCtx = this.revenueChart.nativeElement.getContext('2d');
    this.charts.push(new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: this.analytics.topProducts.map(product => product.name),
        datasets: [{
          data: this.analytics.topProducts.map(product => product.revenue),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Revenue Distribution' },
          legend: { position: 'right' }
        }
      }
    }));

    // Sales Trend Chart (Weekly comparison)
    if (this.salesTrendChart?.nativeElement) {
      const trendCtx = this.salesTrendChart.nativeElement.getContext('2d');
      const weeklyData = this.getWeeklyComparison();
      
      this.charts.push(new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: weeklyData.labels,
          datasets: [{
            label: 'This Week',
            data: weeklyData.currentWeek,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4
          }, {
            label: 'Last Week',
            data: weeklyData.lastWeek,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Weekly Sales Comparison' }
          }
        }
      }));
    }
  }

  private getWeeklyComparison() {
    // Mock data - replace with actual data processing
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      currentWeek: [1500, 2000, 1800, 2200, 1600, 2400, 2100],
      lastWeek: [1400, 1900, 1700, 2000, 1500, 2300, 2000]
    };
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }
}