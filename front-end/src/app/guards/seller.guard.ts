import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.cookieService.get('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const decodedToken = this.authService.decodeToken(token);
    if (decodedToken && decodedToken.role === 'seller') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
} 