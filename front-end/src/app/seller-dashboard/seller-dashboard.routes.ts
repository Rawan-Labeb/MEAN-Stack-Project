import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { SalesChartComponent } from './analytics/sales-chart/sales-chart.component';
import { ProductListComponent } from './products/product-list/product-list.component';

export const SELLER_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'products',
        component: ProductListComponent
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