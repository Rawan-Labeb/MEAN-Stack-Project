import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:"", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)},
  {
    path: 'seller',
    loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
      .then(m => m.SELLER_ROUTES)
  },
  { path: '', redirectTo: 'seller', pathMatch: 'full' }
];