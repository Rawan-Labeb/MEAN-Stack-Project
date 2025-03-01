import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOnlineBranch: boolean = false;
  
  branchName: string = "Main Store";
  branchType: string = "Online";
  
  menuItems = [
    { path: './home', icon: 'fas fa-home', title: 'Dashboard' },
    { path: './sub-inventory', icon: 'fas fa-boxes', title: 'Sub Inventory' },
    { path: './distribution-requests', icon: 'fas fa-truck-loading', title: 'Stock Requests' },
    { path: './orders', icon: 'fas fa-shopping-cart', title: 'Orders' },
  ];

  constructor() { }

  ngOnInit(): void {
    // This would typically come from a service or parent component
    // For now, we're setting it statically
    // Check if this is an online branch
    if (this.isOnlineBranch) {
      this.branchType = 'Online Branch';
      this.branchName = 'Online Store';
      
      // Add complaints menu item for online branches only
      this.menuItems.push({
        path: './complaints',
        icon: 'fas fa-comments',
        title: 'Complaints'
      });
    }
  }
  
  logout(): void {
    // Implement logout functionality
    console.log('Logout clicked');
  }
}