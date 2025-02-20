import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard/sales-clerk-dashboard.component';
import { DashboardHomeComponent } from './sales-clerk-dashboard/dashboard-home/dashboard-home.component';
import { OrdersComponent } from './sales-clerk-dashboard/orders/orders.component';
import { CustomersComponent } from './sales-clerk-dashboard/customers/customers.component';
import { BranchProductsComponent } from './sales-clerk-dashboard/branch-products/branch-products.component';
import { ComplaintsComponent } from './sales-clerk-dashboard/complaints/complaints.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes')
          .then(m => m.adminDashboardRoutes) // Changed to match the actual export name
      }
    ]
  },
  { 
    path: 'seller', 
    component: SellerDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
          .then(m => m.SELLER_DASHBOARD_ROUTES)
      }
    ]
  },
  { 
    path: 'sales-clerk',
    component: SalesClerkDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'branch-products', component: BranchProductsComponent },
      { path: 'complaints', component: ComplaintsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' } 
];
