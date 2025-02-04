import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)}
];
