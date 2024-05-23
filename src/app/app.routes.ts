// app.routes.ts

import { Routes } from '@angular/router';
import { MainViewComponent } from './main-view/main-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: MainViewComponent
    },
    {
        path: 'admin',
        component: AdminViewComponent
    },
];