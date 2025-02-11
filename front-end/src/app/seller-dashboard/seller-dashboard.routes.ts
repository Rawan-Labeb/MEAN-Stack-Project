import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { SalesChartComponent } from './analytics/sales-chart/sales-chart.component';

export const SELLER_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/product-list/product-list.component')
          .then(m => m.ProductListComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/order-list/order-list.component')
          .then(m => m.OrderListComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/sales-chart/sales-chart.component')
          .then(m => m.SalesChartComponent)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];