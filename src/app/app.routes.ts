import { Routes } from '@angular/router';
import { RouteTreeNode } from './core/routes/route-tree-node';

const ROOT_ROUTE_NODE = new RouteTreeNode('', 'Inicio')

export const ROOT_ROUTE_BRANCHES = {
    BASE: ROOT_ROUTE_NODE,
    AUTH: ROOT_ROUTE_NODE.addChild('AUTH', 'auth', 'Autenticación'),
    DASHBOARD: ROOT_ROUTE_NODE.addChild('DASHBOARD', 'dashboard', 'Principal'),
};

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROOT_ROUTE_BRANCHES.AUTH.path,
        pathMatch: 'full'
    },
    {
        path: ROOT_ROUTE_BRANCHES.AUTH.path,
        loadChildren: () => import('./features/auth/pages/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: ROOT_ROUTE_BRANCHES.DASHBOARD.path,
        loadChildren: () => import('./features/dashboard/pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: '**',
        redirectTo: ROOT_ROUTE_BRANCHES.AUTH.path
    }
];
