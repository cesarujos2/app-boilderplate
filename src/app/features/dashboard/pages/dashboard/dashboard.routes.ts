// dashboard.routes.ts
import { Routes } from '@angular/router';
import DashboardPage from './dashboard.page';
import { ROOT_ROUTE_BRANCHES } from 'app/app.routes';

const DASHBOARD_ROUTE_NODE = ROOT_ROUTE_BRANCHES.DASHBOARD;

export const DASHBOARD_ROUTE_BRANCHES = {
  BASE: DASHBOARD_ROUTE_NODE,
  OVERVIEW: DASHBOARD_ROUTE_NODE.addChild('OVERVIEW', 'overview', 'General'),
};

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '**',
        redirectTo: DASHBOARD_ROUTE_BRANCHES.OVERVIEW.path,
      }
    ],
  },
];