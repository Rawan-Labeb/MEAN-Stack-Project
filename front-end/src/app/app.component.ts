import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Footer, Header, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './authentication/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HttpClient } from '@angular/common/http';
import { createCategories } from './utils/create-categories';


import { UserProfileComponent } from "./user-profile/user-profile.component";
import { RequestChangePasswordComponent } from './authentication/request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './authentication/change-password/change-password.component';
import { SellerDashboardComponent } from "./seller-dashboard/seller-dashboard.component";

// import { HeaderComponent } from "./admin-dashboard/core/header/header.component";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    HeaderComponent
  ],
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