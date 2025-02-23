import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Footer, Header, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './authentication/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HttpClient } from '@angular/common/http';
import { createCategories } from './utils/create-categories';


import { RegisterComponent } from "./authentication/register/register.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from './checkout/checkout.component';
import { CachierComponent } from './cachier/cachier.component';
// import { StatisticsComponent } from '../app/cachier/statistics/statistics.component';
import { RequestChangePasswordComponent } from './authentication/request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './authentication/change-password/change-password.component';
import { SellerDashboardComponent } from "./seller-dashboard/seller-dashboard.component";

// import { HeaderComponent } from "./admin-dashboard/core/header/header.component";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { userRoutes } from './authentication/user.routes';
@Component({
  selector: 'app-root',
  standalone: true,
imports: [
    RouterOutlet, FooterComponent, HeaderComponent, NotFoundComponent, LoginComponent, UserProfileComponent,
    CartComponent,CheckoutComponent,CachierComponent,CommonModule
    //StatisticsComponent
    //,ProductDetailsComponent
    // NotFoundComponent,AboutComponent,ContactUsComponent,HomeComponent,ProductDetailsComponent,
    // FooterComponent,HeaderComponent,CatalogComponent
    
],
templateUrl: './app.component.html',

  providers: [MessageService],
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    // Comment this out after categories are created
    // await createCategories(this.http);
  }

  isDashboardRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/seller') || 
           currentUrl.includes('/admin') || 
           currentUrl.includes('/sales-clerk');
  }
}