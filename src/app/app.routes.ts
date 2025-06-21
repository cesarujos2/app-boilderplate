import { Routes } from '@angular/router';
import { ROOT_ROUTE_BRANCHES } from '@core/routes/route-branches';
import { authGuard, noAuthGuard, sessionValidGuard } from '@core/guards';

// Re-exportar para mantener compatibilidad
export { ROOT_ROUTE_BRANCHES };

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROOT_ROUTE_BRANCHES.AUTH.path,
        pathMatch: 'full'
    },
    {
        path: ROOT_ROUTE_BRANCHES.AUTH.path,
        canActivate: [noAuthGuard], // Prevenir acceso si ya está autenticado
        loadChildren: () => import('./features/auth/pages/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: ROOT_ROUTE_BRANCHES.DASHBOARD.path,
        canActivate: [authGuard, sessionValidGuard], // Requiere autenticación
        loadChildren: () => import('./features/dashboard/pages/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: '**',
        redirectTo: ROOT_ROUTE_BRANCHES.AUTH.path
    }
];
