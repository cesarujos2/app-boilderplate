/**
 * Dashboard routes using the new centralized routing system
 * Clean, simple route definitions without circular dependencies
 */
import { Routes } from '@angular/router';
import DashboardPage from './dashboard.page';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview.component'),
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'overview',
      }
    ],
  },
];