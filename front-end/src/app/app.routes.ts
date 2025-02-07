import { Routes } from '@angular/router';
//import { CartComponent } from './Shopping/cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';  

export const routes: Routes = [
  {
    path: 'seller',
    loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
      .then(m => m.SELLER_ROUTES)
  },
  { path: '', redirectTo: 'seller', pathMatch: 'full' }
];