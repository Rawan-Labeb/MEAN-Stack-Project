import { Component, OnInit } from '@angular/core';
import { Login } from '../../_models/login';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormsModule
// import { UserServiceService } from '../../_services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [CookieService]
  styleUrl: './login.component.css',
  providers: [CookieService]
})
export class LoginComponent 
{
  loginFromTwo:FormGroup;
  constructor(
    public loginSer:AuthServiceService,
    public cookieService:CookieService
  ){


    this.loginFromTwo = new FormGroup({
      email:new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required, 
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ])      
      })
      this.loginForm = new Login(this.validate("email")?.value, this.validate("password")?.value, "");

  }

  loginForm:Login;

  loginData:Login = new Login("", "", "");

  Login() {


    console.log(this.validate("email")?.value)

    if (this.loginFromTwo.valid) {
      const email = this.loginFromTwo.get('email')?.value;
      const password = this.loginFromTwo.get('password')?.value;
  
      console.log("Email:", email);
      console.log("Password:", password);
  
      this.loginData = new Login(email, password, "");

      this.loginSer.login(this.loginData).subscribe({
        next: (data) => {
          this.cookieService.set("token", data.token);
        },
        error: (error) => {
          console.log(error.error.message)
          console.log(error)
                
        }
      })



    } else {
      console.log("Form is invalid");
    }
  }
  



  validate (inpupt:string)
  {
    return this.loginFromTwo.get(`${inpupt}`)
  }



}
