import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { SellersComponent } from './pages/sellers/sellers.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CategoryComponent } from './pages/category/category.component';
import { ReviewComponent } from './pages/review/review.component';



export const adminDashboardRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'sellers', component: SellersComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'orders', component:OrdersComponent },
    { path: 'categories', component: CategoryComponent },
    { path: 'reviews', component: ReviewComponent },
    { path: 'contact', component: ContactComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(adminDashboardRoutes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}