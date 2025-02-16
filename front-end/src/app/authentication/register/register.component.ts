import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { register } from 'src/app/_models/register';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userSer:AuthServiceService,
        public cookieService:CookieService

  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.flag = this.passwordMatchValidator(this.registerForm);


  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value
      ? false : true;
  }

  register() {
    if (this.registerForm.invalid) {
      // Handle form validation errors
      return;
    }

    const user: register = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      token: "",
      // Note: Confirm Password is not included in the user object
    };

    this.userSer.register(user).subscribe(response => {
      console.log('User registered successfully:', response);
      this.cookieService.set("token", response.token);

      // Handle successful registration
    }, error => {
      console.error('Registration failed:', error);
      // Handle registration failure
    });
  }

  flag:boolean;


}