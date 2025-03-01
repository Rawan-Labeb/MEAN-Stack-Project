import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '././layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-sales-clerk-dashboard',
  templateUrl: './sales-clerk-dashboard.component.html',
  styleUrls: ['./sales-clerk-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SidebarComponent, 
    HeaderComponent, 
    FooterComponent
  ]
})
export class SalesClerkDashboardComponent {
  isSidebarOpen = true;
  isOnlineBranch = true; // Added this property

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}