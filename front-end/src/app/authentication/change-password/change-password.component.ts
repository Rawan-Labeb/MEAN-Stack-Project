import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Angular Router
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  selector: 'app-reset-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ResetPasswordComponent implements OnInit
{

  resetPasswordForm: FormGroup;
  token: string = "";
  email: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private authSer: AuthServiceService,
    private router: Router  ,
    private cookieSer:CookieService
  ) { 
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl("", [Validators.required, Validators.pattern('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/')]),
      confirmPassword: new FormControl("", [Validators.required])
    }, {validators: this.passwordMatchValidator}
  );
  }

  ngOnInit(): void {
    this.token = this.cookieSer.get("passwordToken")
    const claims = this.authSer.decodeToken(this.token);
    this.email = claims.email;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;

      this.authSer.resetPassword(this.email, this.token, newPassword).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful',
            text: 'Your password has been reset successfully.',
          }).then(() => {
            this.router.navigate(['/login']);  // Redirect to the login page after successful password reset
          });
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Password Reset Failed',
            text: 'An error occurred while resetting your password. Please try again later.',
          });
        }
      );
    }
  }
}
