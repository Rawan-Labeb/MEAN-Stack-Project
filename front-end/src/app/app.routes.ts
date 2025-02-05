import { Routes } from '@angular/router';
//import { CartComponent } from './Shopping/cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';  

export const routes: Routes = [
    {path:"", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)},
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'cart',
  //   component: CartComponent
  // }
];
