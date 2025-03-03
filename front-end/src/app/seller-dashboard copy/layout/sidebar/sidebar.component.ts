import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  isSidebarOpen = true;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Update navigation methods to use correct paths
  navigateToProducts(): void {
    this.router.navigate(['/seller/products']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/seller/orders']);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/seller/sales']);
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to login page
    this.router.navigate(['/user/login']);
  }
}