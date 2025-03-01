import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingRequests: number;
  revenue: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  isLoading: boolean = true;
  
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingRequests: 0,
    revenue: 0
  };

  ngOnInit(): void {
    // Simulate loading data
    setTimeout(() => {
      this.stats = {
        totalProducts: 128,
        totalOrders: 45,
        pendingRequests: 7,
        revenue: 12850
      };
      this.isLoading = false;
    }, 1000);
  }
}