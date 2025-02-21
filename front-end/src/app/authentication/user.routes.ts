
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestChangePasswordComponent } from './request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './change-password/change-password.component';
import { NgModule } from '@angular/core';
import { routes } from '../app.routes';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { authGuardUserProfile } from './guard/auth.guard';

export const userRoutes : Routes = [
  {path: "login", component: LoginComponent, title: "Login"},
  {path: "register" , component: RegisterComponent, title: "Register"},
  {path: "forgetPassword", component: RequestChangePasswordComponent, title: "Forget Password"},
  {path: "resetPassword", component: ResetPasswordComponent, title: "Reset Password"},
  {path: "userprofile", component: UserProfileComponent,title: "User Profile" , canActivate: [authGuardUserProfile]}

]


