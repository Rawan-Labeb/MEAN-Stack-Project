import { Routes } from '@angular/router';
//import { CartComponent } from './Shopping/cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';  

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NotFoundComponent } from './not-found/not-found.component';


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
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog/details/:id",component:ProductDetailsComponent},
  {path:"contact",component:ContactUsComponent},
  {path:"**",component:NotFoundComponent},
];
