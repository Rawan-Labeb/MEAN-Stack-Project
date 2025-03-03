import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

export const sellerGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  // Check if user is authenticated
  const token = cookieService.get('token') || localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token exists
    router.navigate(['/user/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
  
  try {
    // Decode the token
    const decodedToken: any = jwtDecode(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      // Token expired, redirect to login
      router.navigate(['/user/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
    // Verify that the user has the seller role
    if (decodedToken.role === 'seller') {
      return true;
    } else {
      // User doesn't have seller role
      router.navigate(['/access-denied']);
      return false;
    }
  } catch (error) {
    // Invalid token
    router.navigate(['/user/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
};