import { Component } from '@angular/core';
import { Login } from '../../_models/login';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CookieService]
})
export class LoginComponent {
  loginFromTwo: FormGroup;
  loginForm: Login;
  loginData: Login = new Login("", "", "");

  constructor(
    public loginSer: AuthServiceService,
    public cookieService: CookieService,
    private router: Router
  ) {
    this.loginFromTwo = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ])
    });
    this.loginForm = new Login(this.validate("email")?.value || "", this.validate("password")?.value || "", "");
  }

  Login() {
    console.log(this.validate("email")?.value);

    if (this.loginFromTwo.valid) {
      const email = this.loginFromTwo.get('email')?.value;
      const password = this.loginFromTwo.get('password')?.value;

      console.log("Email:", email);
      console.log("Password:", password);

      this.loginData = new Login(email, password, "");

      this.loginSer.login(this.loginData).subscribe({
        next: (data) => {
          this.cookieService.set("token", data.token);
          // Add navigation after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log(error.error.message);
          console.log(error);
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }

  validate(inpupt: string) {
    return this.loginFromTwo.get(`${inpupt}`);
  }
}
