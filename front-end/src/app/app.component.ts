import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Footer, Header, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './authentication/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';import { RegisterComponent } from "./authentication/register/register.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { RequestChangePasswordComponent } from './authentication/request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './authentication/change-password/change-password.component';
<<<<<<< HEAD

// import { HeaderComponent } from "./admin-dashboard/core/header/header.component";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
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
    ResetPasswordComponent
],
  template: `
      <app-login></app-login>
    <!--
      <app-reset-password></app-reset-password>
      <app-request-change-password></app-request-change-password>
    <app-register></app-register>
  <app-admin-dashboard></app-admin-dashboard>
    <router-outlet></router-outlet>
    <app-user-profile></app-user-profile>
    <p-toast></p-toast> -->
    `,
=======
import { SellerDashboardComponent } from "./seller-dashboard/seller-dashboard.component";

// import { HeaderComponent } from "./admin-dashboard/core/header/header.component";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
@Component({
  selector: 'app-root',
  // standalone: true,
//   imports: [
//     RouterOutlet,
//     FooterComponent,
//     ToastModule,
//     CommonModule,
//     AdminDashboardComponent,
//     HeaderComponent
// ],
imports: [
  RouterOutlet,FooterComponent,HeaderComponent,NotFoundComponent
  //,ProductDetailsComponent
  // NotFoundComponent,AboutComponent,ContactUsComponent,HomeComponent,ProductDetailsComponent,
  // FooterComponent,HeaderComponent,CatalogComponent

],
templateUrl: './app.component.html',

>>>>>>> fab042054455a9e9805348b378ab2ec79f5e6468
  providers: [MessageService],
  styles: []
})
export class AppComponent {
  title = 'E-commerce App';
}