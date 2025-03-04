import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../_services/auth-service.service';
import { jwtDecode } from 'jwt-decode';

export const sellerAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);
  
  // First check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    // Not authenticated, redirect to login with correct path
    router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Get token from the auth service
  const token = authService.getToken();
  
  // If token exists, try to decode it and check role
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      
      // Check if user has seller role - adjust the property name as needed
      // This depends on your token structure
      if (decodedToken.role === 'seller' || 
          decodedToken.userType === 'seller' || 
          (decodedToken.roles && decodedToken.roles.includes('seller'))) {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  // If we get here, user doesn't have seller role or token couldn't be decoded
  console.log('User is not a seller, redirecting to home');
  router.navigate(['/']);
  return false;
};