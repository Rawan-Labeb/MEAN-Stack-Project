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
    // Set default date range to last 30 days
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    
    // Set start date to 30 days ago
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    this.startDate = lastMonth.toISOString().split('T')[0];
    
    console.log('Default date range:', this.startDate, 'to', this.endDate);
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

    // Add debugging to see what's happening
    console.log('Loading analytics with date range:', this.startDate, 'to', this.endDate);

    this.orderService.getSellerOrders().pipe(
      catchError(error => {
        console.error('Order fetch error:', error);
        return of([]);
      })
    ).subscribe({
      next: (orders) => {
        console.log('Received orders:', orders);
        
        if (!orders || orders.length === 0) {
          this.error = 'No orders found for this seller';
          this.loading = false;
          return;
        }
        
        // Filter orders by date range if dates are provided
        let filteredOrders = orders;
        if (this.startDate && this.endDate) {
          const startDate = new Date(this.startDate);
          const endDate = new Date(this.endDate);
          endDate.setHours(23, 59, 59); // Include the entire end day
          
          filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt || order.date || '');
            return orderDate >= startDate && orderDate <= endDate;
          });
          
          console.log(`Filtered ${orders.length} orders to ${filteredOrders.length} within date range`);
          
          if (filteredOrders.length === 0) {
            this.error = 'No orders found in the selected date range';
            this.loading = false;
            return;
          }
        }
        
        this.analytics = this.processOrdersData(filteredOrders);
        console.log('Processed analytics data:', this.analytics);
        
        setTimeout(() => {
          this.initializeCharts();
        }, 0);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load analytics data';
        console.error('Analytics error:', err);
        this.loading = false;
      }
    });
  }

  // Update your processOrdersData method to handle invalid dates
  private processOrdersData(orders: Order[]): AnalyticsData {
    const salesByDate = new Map<string, { amount: number; count: number }>();
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
    let totalRevenue = 0;
    let totalOrders = orders.length;
  
    orders.forEach(order => {
      // Fix the date handling to avoid Invalid time value error
      let dateString: string;
      try {
        // First try to create a valid date from createdAt or date
        const orderDate = new Date(order.createdAt || order.date || '');
        
        // Check if date is valid before calling toISOString()
        if (isNaN(orderDate.getTime())) {
          // If invalid date, use today's date as fallback
          dateString = new Date().toISOString().split('T')[0];
          console.warn('Invalid date detected, using today as fallback', order);
        } else {
          dateString = orderDate.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error processing date:', error, order);
        // Use current date as fallback
        dateString = new Date().toISOString().split('T')[0];
      }
      
      // Now use the safely created dateString
      const existing = salesByDate.get(dateString) || { amount: 0, count: 0 };
      salesByDate.set(dateString, {
        amount: existing.amount + order.totalPrice,
        count: existing.count + 1
      });
  
      // Process product sales - this part seems fine
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
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
    if (!this.analytics) {
      console.warn('No analytics data available for charts');
      return;
    }
    
    if (!this.salesChart?.nativeElement) {
      console.warn('Missing salesChart element');
      return;
    }
    
    console.log('Starting chart initialization');
    this.destroyCharts();
    
    try {
      this.createDailySalesChart();
      console.log('Sales chart created');
      
      this.createTopProductsChart();
      console.log('Products chart created');
      
      this.createRevenueDistributionChart();
      console.log('Revenue chart created');
      
      this.createSalesTrendChart();
      console.log('Trend chart created');
      
      console.log('All charts initialized successfully');
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  }

  private createDailySalesChart(): void {
    const salesCtx = this.salesChart.nativeElement.getContext('2d');
    
    // Sort sales data by date
    const sortedSales = [...this.analytics!.sales].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    this.charts.push(new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: sortedSales.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Revenue ($)',
            data: sortedSales.map(item => item.amount),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Orders',
            data: sortedSales.map(item => item.count),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true,
            borderDash: [5, 5],
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Daily Sales Trend' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return label === 'Revenue ($)' ? `${label}: $${value.toFixed(2)}` : `${label}: ${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Revenue ($)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Number of Orders' }
          }
        }
      }
    }));
  }

  private createTopProductsChart(): void {
    const productsCtx = this.productsChart.nativeElement.getContext('2d');
    
    this.charts.push(new Chart(productsCtx, {
      type: 'bar',
      data: {
        labels: this.analytics!.topProducts.map(product => product.name),
        datasets: [
          {
            label: 'Units Sold',
            data: this.analytics!.topProducts.map(product => product.sales),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            order: 2
          },
          {
            label: 'Revenue ($)',
            data: this.analytics!.topProducts.map(product => product.revenue),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            type: 'line',
            order: 1,
            yAxisID: 'revenue'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',  // Horizontal bar chart for better readability
        plugins: {
          title: { display: true, text: 'Best Selling Products' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.x;
                return label === 'Revenue ($)' ? `${label}: $${value.toFixed(2)}` : `${label}: ${value}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Units Sold' }
          },
          revenue: {
            position: 'top',
            beginAtZero: true,
            title: { display: true, text: 'Revenue ($)' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    }));
  }

  private createRevenueDistributionChart(): void {
    const revenueCtx = this.revenueChart.nativeElement.getContext('2d');
    
    this.charts.push(new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: this.analytics!.topProducts.map(product => product.name),
        datasets: [{
          data: this.analytics!.topProducts.map(product => product.revenue),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Revenue Distribution' },
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value * 100) / total);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    }));
  }

  private getWeeklyComparison() {
    // If no analytics or sales data, return mock data
    if (!this.analytics || !this.analytics.sales || this.analytics.sales.length < 7) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        currentWeek: [1500, 2000, 1800, 2200, 1600, 2400, 2100],
        lastWeek: [1400, 1900, 1700, 2000, 1500, 2300, 2000]
      };
    }
  
    // Get current date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate start dates for this week and last week
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday day 0
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - daysFromMonday);
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    
    // Get daily sales for this week and last week
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentWeekData = Array(7).fill(0);
    const lastWeekData = Array(7).fill(0);
    
    this.analytics.sales.forEach(sale => {
      try {
        // Safely parse the date
        const saleDate = new Date(sale.date);
        
        // Check if date is valid
        if (isNaN(saleDate.getTime())) {
          console.warn('Invalid sale date detected, skipping:', sale);
          return;
        }
        
        const timeDiff = saleDate.getTime() - startOfThisWeek.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        // For this week
        if (dayDiff >= 0 && dayDiff < 7) {
          currentWeekData[dayDiff] += sale.amount;
        }
        
        // For last week
        const lastWeekTimeDiff = saleDate.getTime() - startOfLastWeek.getTime();
        const lastWeekDayDiff = Math.floor(lastWeekTimeDiff / (1000 * 3600 * 24));
        if (lastWeekDayDiff >= 0 && lastWeekDayDiff < 7) {
          lastWeekData[lastWeekDayDiff] += sale.amount;
        }
      } catch (error) {
        console.error('Error processing weekly sale data:', error);
      }
    });
    
    return {
      labels: dayNames,
      currentWeek: currentWeekData,
      lastWeek: lastWeekData
    };
  }

  private createSalesTrendChart(): void {
    if (!this.salesTrendChart?.nativeElement) return;
    
    const trendCtx = this.salesTrendChart.nativeElement.getContext('2d');
    const weeklyData = this.getWeeklyComparison();
    
    this.charts.push(new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: weeklyData.labels,
        datasets: [
          {
            label: 'This Week',
            data: weeklyData.currentWeek,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
          }, 
          {
            label: 'Last Week',
            data: weeklyData.lastWeek,
            borderColor: 'rgba(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Weekly Sales Comparison' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: $${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Revenue ($)' }
          }
        }
      }
    }));
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }
}