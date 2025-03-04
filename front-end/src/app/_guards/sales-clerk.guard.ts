import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../_services/auth-service.service';
import { map, catchError, of } from 'rxjs';

export const salesClerkGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);
  
  // First check if the user is authenticated
  const token = authService.getToken();
  if (!token) {
    // Redirect to login page with return URL
    router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Then check if the user has the clerk role
  return authService.decodeToken(token).pipe(
    map(decoded => {
      if (decoded && decoded.role === 'clerk') {
        // User has the clerk role, allow access
        return true;
      } else {
        // User doesn't have clerk role, redirect to login
        router.navigate(['/user/login'], { 
          queryParams: { 
            returnUrl: state.url, 
            message: 'You need sales clerk permissions to access this area' 
          } 
        });
        return false;
      }
    }),
    catchError(() => {
      // Token decoding error, redirect to login
      router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};