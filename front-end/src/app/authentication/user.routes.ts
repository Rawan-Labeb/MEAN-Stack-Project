
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestChangePasswordComponent } from './request-change-password/request-change-password.component';
import { ResetPasswordComponent } from './change-password/change-password.component';

export const userRoutes : Routes = [
  {path: "login", component:LoginComponent, title: "Login" },
  {path: "register" , component: RegisterComponent},
  {path: "forgetPassword", component: RequestChangePasswordComponent},
  {path: "resetPassword", component: ResetPasswordComponent}
]


