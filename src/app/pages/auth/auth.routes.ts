// auth.routes.ts
import { Routes } from '@angular/router';
import AuthPage from './auth.page';
import { MAIN_PATHS } from '../../app.routes';

export const AUTH_PATHS = {
  BASE_PATH: [...MAIN_PATHS.BASE_PATH, MAIN_PATHS.AUTH],
  LOGIN: 'login',
  REGISTER: 'register',
  FULL: {
    LOGIN: () => [...AUTH_PATHS.BASE_PATH, AUTH_PATHS.LOGIN],
    REGISTER: () => [...AUTH_PATHS.BASE_PATH, AUTH_PATHS.REGISTER],
  }
}

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: AUTH_PATHS.LOGIN,
        loadComponent: () => import('./login/login.component'),
      },
      {
        path: AUTH_PATHS.REGISTER,
        loadComponent: () => import('./register/register.component'),
      },
      {
        path: '',
        redirectTo: AUTH_PATHS.LOGIN,
        pathMatch: 'full',
      },
    ],
  },
];
