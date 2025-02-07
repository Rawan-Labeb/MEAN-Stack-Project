import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { SalesChartComponent } from './analytics/sales-chart/sales-chart.component';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    component: SellerDashboardComponent,
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
        path: 'sales',
        loadComponent: () => import('./analytics/sales-chart/sales-chart.component')
          .then(m => m.SalesChartComponent)
      },
      {
        path: 'analytics',
        component: SalesChartComponent
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];