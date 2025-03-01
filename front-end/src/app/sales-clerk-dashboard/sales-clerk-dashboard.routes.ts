import { Routes } from '@angular/router';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { OrdersComponent } from './orders/orders.component';
import { BranchProductsComponent } from './branch-products/branch-products.component';
import { DistributionRequestsComponent } from './distribution-requests/distribution-requests.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { SubInventoryComponent } from './sub-inventory/sub-inventory.component';

export const salesClerkDashboardRoutes: Routes = [
  {
    path: '',
    component: SalesClerkDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: BranchProductsComponent },
      { path: 'distribution-requests', component: DistributionRequestsComponent },
      { path: 'sub-inventory', component: SubInventoryComponent },
      { path: 'complaints', component: ComplaintsComponent }
    ]
  }
];