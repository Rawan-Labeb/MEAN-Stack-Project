import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class SellerAuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only intercept requests to product API endpoints
    if (request.url.includes('/product/')) {
      console.log('Seller interceptor processing request to:', request.url);
      
      // Get token from both sources
      const token = localStorage.getItem('token') || this.cookieService.get('token');
      
      if (token) {
        // Clone the request with the authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Seller interceptor added auth token');
      } else {
        console.warn('Seller interceptor: No token found');
      }
    }
    
    return next.handle(request);
  }
}