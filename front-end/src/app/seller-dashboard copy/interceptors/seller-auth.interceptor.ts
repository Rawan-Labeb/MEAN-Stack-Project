import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// Keep your class-based interceptor
@Injectable()
export class SellerAuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept requests to the product API
    if (req.url.includes('/product/')) {
      // Get token from cookies or localStorage
      const token = this.cookieService.get('token') || localStorage.getItem('token') || '';
      
      if (token) {
        // Always ensure the token has the Bearer prefix
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        // Clone the request and add the properly formatted Authorization header
        const authReq = req.clone({
          setHeaders: { Authorization: authToken }
        });
        
        console.log('Added proper Bearer token to request');
        return next.handle(authReq);
      }
    }
    
    // For all other requests, proceed normally
    return next.handle(req);
  }
}

// Add the functional interceptor
export const sellerAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept requests to the product API
  if (req.url.includes('/product/')) {
    // Get token from localStorage (can't inject CookieService in functional interceptor)
    const token = localStorage.getItem('token') || '';
    
    if (token) {
      // Always ensure the token has the Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Clone the request and add the properly formatted Authorization header
      const authReq = req.clone({
        setHeaders: { Authorization: authToken }
      });
      
      console.log('Added proper Bearer token to request');
      return next(authReq);
    }
  }
  
  // For all other requests, proceed normally
  return next(req);
};

// Also export provider function for class-based usage if needed
export function provideSellerAuthInterceptor() {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: SellerAuthInterceptor,
    multi: true
  };
}