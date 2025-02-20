import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './authentication/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RegisterComponent } from "./authentication/register/register.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from './checkout/checkout.component';
import { CachierComponent } from './cachier/cachier.component';
import { StatisticsComponent } from '../app/cachier/statistics/statistics.component';
import { RequestChangePasswordComponent } from './authentication/request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './authentication/change-password/change-password.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    CommonModule,
    AdminDashboardComponent,
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    RequestChangePasswordComponent,
    ResetPasswordComponent,
    CartComponent,
    CheckoutComponent,
    CachierComponent,
    StatisticsComponent
],
  template: `
  <!-- <app-cart></app-cart> -->
    <!-- <app-reset-password></app-reset-password> -->
    <!--
      <app-request-change-password></app-request-change-password>
    <app-login></app-login>
    <app-register></app-register>
  <app-admin-dashboard></app-admin-dashboard>
    <router-outlet></router-outlet>
    <app-user-profile></app-user-profile>
    <p-toast></p-toast> -->
    <!-- <app-cachier></app-cachier> -->
    <app-statistics></app-statistics>
    <!-- <router-outlet></router-outlet> -->

    `,
  providers: [MessageService],
  styles: []
})
export class AppComponent {
  title = 'E-commerce App';
}