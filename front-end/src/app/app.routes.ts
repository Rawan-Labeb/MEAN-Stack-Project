import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './authentication/register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard/sales-clerk-dashboard.component';
import { DashboardHomeComponent } from './sales-clerk-dashboard/dashboard-home/dashboard-home.component';
import { OrdersComponent } from './sales-clerk-dashboard/orders/orders.component';
import { CustomersComponent } from './sales-clerk-dashboard/customers/customers.component';
import { BranchProductsComponent } from './sales-clerk-dashboard/branch-products/branch-products.component';
import { ComplaintsComponent } from './sales-clerk-dashboard/complaints/complaints.component';

export const routes: Routes = [
  {path:"admindashboard", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)},
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog/details/:id",component:ProductDetailsComponent},
  {path:"contact",component:ContactUsComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"userprofile",component:UserProfileComponent},
  {path:"sellerdashboard",component:SellerDashboardComponent},
  
  {path:"**",component:NotFoundComponent},
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
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes')
          .then(m => m.adminDashboardRoutes) // Changed to match the actual export name
      }
    ]
  },
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
  },
  { 
    path: 'sales-clerk',
    component: SalesClerkDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'branch-products', component: BranchProductsComponent },
      { path: 'complaints', component: ComplaintsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' } 
];
