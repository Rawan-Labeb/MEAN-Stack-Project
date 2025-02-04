
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const userRoutes : Routes = [
  {path: "login", component:LoginComponent, title: "Login" },
  {path: "register" , component: RegisterComponent}
]


