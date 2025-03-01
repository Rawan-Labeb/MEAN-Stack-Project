import { Routes } from '@angular/router';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { OrdersComponent } from './orders/orders.component';
import { BranchProductsComponent } from './branch-products/branch-products.component';
// Remove or comment out any auth guard imports:
// import { salesClerkAuthGuard } from '../_guards/sales-clerk-auth.guard';

export const salesClerkDashboardRoutes: Routes = [
  {
    path: '',
    component: SalesClerkDashboardComponent,
    // Remove or comment out the canActivate line:
    // canActivate: [salesClerkAuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: BranchProductsComponent }
    ]
  }
];