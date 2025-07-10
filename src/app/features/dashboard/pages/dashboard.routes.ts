// dashboard.routes.ts
import { Routes } from '@angular/router';
import { ROOT_ROUTE_BRANCHES } from '../../../core/routes/route-branches';
import DashboardPage from './dashboard.page';
import { adminGuard } from '@core/guards';

const DASHBOARD_ROUTE_NODE = ROOT_ROUTE_BRANCHES.DASHBOARD;

export const DASHBOARD_ROUTE_BRANCHES = {
  BASE: DASHBOARD_ROUTE_NODE,
  OVERVIEW: DASHBOARD_ROUTE_NODE.addChild('OVERVIEW', 'overview', 'General'),
  DATASHEETS: DASHBOARD_ROUTE_NODE.addChild('DATASHEETS', 'fichas', 'Fichas Técnicas'),
  ADMIN: DASHBOARD_ROUTE_NODE.addChild('ADMIN', 'admin', 'Administración'),
};

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '',
        redirectTo: DASHBOARD_ROUTE_BRANCHES.DATASHEETS.path,
        pathMatch: 'full',
      },
      {
        path: DASHBOARD_ROUTE_BRANCHES.DATASHEETS.path,
        loadComponent: () => import('./datasheet/datasheet.page').then(m => m.DatasheetPageComponent),
      },
      {
        path: DASHBOARD_ROUTE_BRANCHES.ADMIN.path,
        canActivate: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
      {
        path: '**',
        redirectTo: DASHBOARD_ROUTE_BRANCHES.DATASHEETS.path,
      }
    ],
  },
];