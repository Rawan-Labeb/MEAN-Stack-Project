import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
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
  }
];
