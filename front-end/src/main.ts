import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/_interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

// Import the functional interceptor correctly
import { sellerAuthInterceptor } from './app/seller-dashboard copy/interceptors/seller-auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Use both interceptors
    provideHttpClient(withInterceptors([authInterceptor, sellerAuthInterceptor])),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideToastr(),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));