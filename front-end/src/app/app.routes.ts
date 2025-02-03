import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:"", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes)}
];
