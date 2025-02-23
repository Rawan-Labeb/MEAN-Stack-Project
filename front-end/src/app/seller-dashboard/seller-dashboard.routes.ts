import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
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
        component: OrderListComponent
      },
      {
        path: 'analytics',
        component: SalesChartComponent
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];