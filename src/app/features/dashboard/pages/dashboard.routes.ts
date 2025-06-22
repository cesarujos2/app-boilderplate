// dashboard.routes.ts
import { Routes } from '@angular/router';
import { ROOT_ROUTE_BRANCHES } from '../../../core/routes/route-branches';
import DashboardPage from './dashboard.page';

const DASHBOARD_ROUTE_NODE = ROOT_ROUTE_BRANCHES.DASHBOARD;

export const DASHBOARD_ROUTE_BRANCHES = {
  BASE: DASHBOARD_ROUTE_NODE,
  OVERVIEW: DASHBOARD_ROUTE_NODE.addChild('OVERVIEW', 'overview', 'General'),
  DATASHEETS: DASHBOARD_ROUTE_NODE.addChild('DATASHEETS', 'fichas', 'Fichas Técnicas'),
};

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '',
        redirectTo: DASHBOARD_ROUTE_BRANCHES.OVERVIEW.path,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: DASHBOARD_ROUTE_BRANCHES.OVERVIEW.path,
      }
    ],
  },
];