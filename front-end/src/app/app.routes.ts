import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'seller',
    loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
      .then(m => m.SELLER_ROUTES)
  },
  { 
    path: '', 
    redirectTo: 'seller/products', 
    pathMatch: 'full' 
  }
];