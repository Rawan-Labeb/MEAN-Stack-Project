
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestChangePasswordComponent } from './request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './change-password/change-password.component';
import { NgModule } from '@angular/core';
import { routes } from '../app.routes';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { authGuardUserProfile } from './guard/auth.guard';
import { UserComplaintsComponent } from '../user-profile/user-complaints/user-complaints.component';
import { UserOrdersComponent } from '../user-profile/user-orders/user-orders.component';

export const userRoutes : Routes = [
  {path: "login", component: LoginComponent, title: "Login"},
  {path: "register" , component: RegisterComponent, title: "Register"},
  {path: "forgetPassword", component: RequestChangePasswordComponent, title: "Forget Password"},
  {path: "resetPassword", component: ResetPasswordComponent, title: "Reset Password"},
  {path: "userprofile", component: UserProfileComponent,title: "User Profile" , canActivate: [authGuardUserProfile], children: [
    {path: "complaints/:id", component: UserComplaintsComponent ,title: "User Profile Complaint" , canActivate: [authGuardUserProfile]},
    {path: "orders/:id", component: UserOrdersComponent ,title: "User Profile Orders" , canActivate: [authGuardUserProfile]}
  ]},

]


