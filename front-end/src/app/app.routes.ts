import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { RegisterComponent } from './authentication/register/register.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard/sales-clerk-dashboard.component';
import { DashboardHomeComponent } from './sales-clerk-dashboard/dashboard-home/dashboard-home.component';
import { OrdersComponent } from './sales-clerk-dashboard/orders/orders.component';
import { BranchProductsComponent } from './sales-clerk-dashboard/branch-products/branch-products.component';
import { OrderListComponent } from './seller-dashboard/orders/order-list/order-list.component';
import { SalesChartComponent } from './seller-dashboard/analytics/sales-chart/sales-chart.component';
import { SellerGuard } from './guards/seller.guard';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:"admindashboard", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)},
  {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)},
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog/details/:id",component:ProductDetailsComponent},
  {path:"contact",component:ContactUsComponent},
  // {path:"login",component:LoginComponent},
  // {path:"register",component:RegisterComponent},
  // {path:"userprofile",component:UserProfileComponent},
  {path:"sellerdashboard",component:SellerDashboardComponent},
  
  {path:"**",component:NotFoundComponent},
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'cart',
  //   pathMatch: 'full'
  // },
  // { path: '', redirectTo: 'seller', pathMatch: 'full' },
  
];

