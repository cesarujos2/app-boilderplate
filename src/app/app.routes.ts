import { Routes } from '@angular/router';

export const MAIN_PATHS = {
    BASE_PATH: ['/'],
    AUTH: 'auth',
    FULL: {
        AUTH: () => [...MAIN_PATHS.BASE_PATH, MAIN_PATHS.AUTH]
    }
}

export const routes: Routes = [
    {
        path: '',
        redirectTo: MAIN_PATHS.AUTH,
        pathMatch: 'full'
    },
    {
        path: MAIN_PATHS.AUTH,
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
    }
];
