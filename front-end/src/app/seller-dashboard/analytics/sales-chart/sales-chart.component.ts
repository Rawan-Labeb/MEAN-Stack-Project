import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { format } from 'date-fns';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  mockData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    sales: [1200, 1900, 1500, 2000, 2400, 1800],
    revenue: [2400, 3800, 3000, 4000, 4800, 3600],
    products: [
      { name: 'Product A', sales: 64 },
      { name: 'Product B', sales: 51 },
      { name: 'Product C', sales: 43 }
    ]
  };

  ngOnInit(): void {
    // Initial setup
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  initializeCharts() {
    this.createSalesChart();
    this.createRevenueChart();
    this.createProductChart();
  }

  createSalesChart() {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
    
    this.salesChart = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.mockData.months,
        datasets: [{
          label: 'Monthly Sales',
          data: this.mockData.sales,
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Sales Trend' }
        }
      }
    });
  }

  createRevenueChart() {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.mockData.months,
        datasets: [{
          label: 'Revenue',
          data: this.mockData.revenue,
          backgroundColor: '#2196F3'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Monthly Revenue' }
        }
      }
    });
  }

  createProductChart() {
    if (this.productChart) {
      this.productChart.destroy();
    }

    this.productChart = new Chart(this.productChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.mockData.products.map(p => p.name),
        datasets: [{
          data: this.mockData.products.map(p => p.sales),
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Product Distribution' }
        }
      }
    });
  }

  updateDateRange() {
    this.initializeCharts();
  }
}