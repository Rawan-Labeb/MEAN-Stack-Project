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
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard copy/seller-dashboard.component';
import { canLoginSuperAdminGuard } from './_guards/can-login-super-admin.guard';
import { CachierComponent } from './cachier/cachier.component';
import { CartCachierComponent } from './cachier/cart-cachier/cart-cachier.component';
import { CartCheckoutGuard } from './cart/_guards/cart-checkout.guard';
import { CashierGuard } from './cachier/_guard/cashier.guard'
import { SuccessComponent } from './success/success.component';
import { SalesClerkDashboardComponent } from './sales-clerk-dashboard copy/sales-clerk-dashboard.component';
import { sellerGuard } from './_guards/seller.guard';
import { authGuard } from './_guards/auth.guard'; 
import { salesClerkGuard } from './_guards/sales-clerk.guard'; 
import { ProductListComponent } from './seller-dashboard copy/products/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'success', component: SuccessComponent},

  { path: 'cart', component: CartComponent, canActivate: [CartCheckoutGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [CartCheckoutGuard] },
  { path: 'cashier', component: CachierComponent, canActivate: [CashierGuard] },
  { path: 'cartCashier', component: CartCachierComponent, canActivate: [CashierGuard] },
  {path:"admindashboard", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes),canActivate: [canLoginSuperAdminGuard]},
  {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)},
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog/details/:id",component:ProductDetailsComponent},
  {path:"contact",component:ContactUsComponent},
  {
    path: "seller", 
    loadChildren: () => import("./seller-dashboard copy/seller-dashboard.routes")
      .then(s => s.SELLER_DASHBOARD_ROUTES),
    canActivate: [sellerGuard]
  },
  {
    path: "sales-clerk", 
    loadChildren: () => import("./sales-clerk-dashboard copy/sales-clerk-dashboard.routes")
      .then(s => s.SALES_CLERK_ROUTES),
    canActivate: [salesClerkGuard] 
  },
  {path:"**",component:NotFoundComponent},
  {
    path: 'login',
    component: LoginComponent
  },
];



