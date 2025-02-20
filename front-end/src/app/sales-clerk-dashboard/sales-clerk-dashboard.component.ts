import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-sales-clerk-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FooterComponent],
  template: `
    <div class="dashboard-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f8f9fa;
      overflow-y: auto;
    }

    .content-wrapper {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class SalesClerkDashboardComponent {}
