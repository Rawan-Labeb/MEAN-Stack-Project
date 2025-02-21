import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

export const authGuardUserProfile: CanActivateFn = (route, state) => {

  let router = inject(Router);
  let authSer = inject(AuthServiceService)

  if (authSer.isAuthenticated())
  {
    return true;
  }else 
  {
    router.navigateByUrl("/user/login");
    return false;
  }
};
