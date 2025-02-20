import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { OrderService } from '../../services/order.service';
import { format } from 'date-fns';

interface AnalyticsData {
  months: string[];
  sales: number[];
  revenue: number[];
  products: Array<{
    name: string;
    sales: number;
  }>;
}

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('productChart') productChartRef!: ElementRef;

  startDate: string = format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
  endDate: string = format(new Date(), 'yyyy-MM-dd');

  salesChart!: Chart;
  revenueChart!: Chart;
  productChart!: Chart;
  loading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        const analytics = this.processOrdersData(orders);
        this.initializeCharts(analytics);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateDateRange(): void {
    this.loading = true;
    const startDateTime = new Date(this.startDate).getTime();
    const endDateTime = new Date(this.endDate).getTime();

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        // Filter orders by date range
        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.date).getTime();
          return orderDate >= startDateTime && orderDate <= endDateTime;
        });
        
        const analytics = this.processOrdersData(filteredOrders);
        this.initializeCharts(analytics);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  processOrdersData(orders: any[]): AnalyticsData {
    const monthlyData: { [key: string]: { sales: number; revenue: number } } = {};
    const productSales: { [key: string]: number } = {};

    orders.forEach(order => {
      const monthYear = format(new Date(order.date), 'MMM yyyy');
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { sales: 0, revenue: 0 };
      }

      monthlyData[monthYear].sales += order.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      monthlyData[monthYear].revenue += order.totalPrice;

      order.items.forEach((item: any) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });

    return {
      months: Object.keys(monthlyData),
      sales: Object.values(monthlyData).map(d => d.sales),
      revenue: Object.values(monthlyData).map(d => d.revenue),
      products: Object.entries(productSales).map(([id, sales]) => ({
        name: `Product ${id}`,
        sales
      }))
    };
  }

  initializeCharts(analytics: AnalyticsData): void {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.productChart) {
      this.productChart.destroy();
    }

    this.salesChart = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: analytics.months,
        datasets: [{
          label: 'Monthly Sales',
          data: analytics.sales,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });

    this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: analytics.months,
        datasets: [{
          label: 'Monthly Revenue',
          data: analytics.revenue,
          backgroundColor: 'rgb(54, 162, 235)'
        }]
      }
    });

    this.productChart = new Chart(this.productChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: analytics.products.map((p) => p.name),
        datasets: [{
          data: analytics.products.map((p) => p.sales),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
          ]
        }]
      }
    });
  }
}