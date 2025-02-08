import { Routes } from '@angular/router';
//import { CartComponent } from './Shopping/cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';  

export const routes: Routes = [
    {path:"", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)},
  {
    path: 'login',
    component: LoginComponent
  },

    {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)},
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  { path: '', redirectTo: 'seller', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
];
