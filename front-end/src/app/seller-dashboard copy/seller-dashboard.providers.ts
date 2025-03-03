import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SellerAuthInterceptor } from './interceptors/seller-auth.interceptor';

export const SELLER_DASHBOARD_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SellerAuthInterceptor,
    multi: true
  }
];