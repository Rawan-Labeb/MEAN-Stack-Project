import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './authentication/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';import { RegisterComponent } from "./authentication/register/register.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

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
    UserProfileComponent
],
  template: `
  <app-register></app-register>
  <app-admin-dashboard></app-admin-dashboard>
    <router-outlet></router-outlet>
    <p-toast></p-toast>
  `,
  providers: [MessageService],
  styles: []
})
export class AppComponent {
  title = 'E-commerce App';
}