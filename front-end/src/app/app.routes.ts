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
  // Public routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'catalog/details/:id', component: ProductDetailsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userprofile', component: UserProfileComponent },

  // User routes
  {
    path: 'user',
    loadChildren: () => import('./authentication/user.routes').then(route => route.userRoutes)
  },

  // Admin Dashboard
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes')
          .then(m => m.adminDashboardRoutes)
      }
    ]
  },

  // Seller Dashboard 
  {
    path: 'seller',
    component: SellerDashboardComponent,
    canActivate: [SellerGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
          .then(m => m.SELLER_DASHBOARD_ROUTES)
      },
      { path: 'orders', component: OrderListComponent },
      { path: 'analytics', component: SalesChartComponent }
    ]
  },

  // Sales Clerk Dashboard
  {
    path: 'sales-clerk',
    component: SalesClerkDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'branch-products', component: BranchProductsComponent }
    ]
  },

  // Catch-all route for 404
  { path: '**', component: NotFoundComponent }
];
