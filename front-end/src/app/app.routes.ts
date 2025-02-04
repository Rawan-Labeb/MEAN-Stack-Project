import { Routes } from '@angular/router';

export const routes: Routes = [
<<<<<<< HEAD
    {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)}
];
=======
  {
    path: 'seller',
    loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
      .then(m => m.SELLER_ROUTES)
  },
  { path: '', redirectTo: 'seller', pathMatch: 'full' }
];
>>>>>>> 7ce220b3cf7b87f30dea96a276a64e52712a3314
