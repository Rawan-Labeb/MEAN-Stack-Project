import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';

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
        path: 'analytics',
        loadComponent: () => import('./analytics/sales-chart/sales-chart.component')
          .then(m => m.SalesChartComponent)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];