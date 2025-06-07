// auth.routes.ts
import { Routes } from '@angular/router';
import AuthPage from './auth.page';
import { ROOT_ROUTE_BRANCHES } from 'app/app.routes';

const AUTH_ROUTE_NODE = ROOT_ROUTE_BRANCHES.AUTH;

export const AUTH_ROUTE_BRANCHES = {
  BASE: AUTH_ROUTE_NODE,
  LOGIN: AUTH_ROUTE_NODE.addChild('LOGIN', 'login', 'Iniciar sesión'),
  REGISTER: AUTH_ROUTE_NODE.addChild('REGISTER', 'register', 'Registrarse'),
  FORGOT_PASSWORD: AUTH_ROUTE_NODE.addChild('FORGOT_PASSWORD', 'forgot-password', 'Olvidé mi contraseña'),
}

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: AUTH_ROUTE_BRANCHES.LOGIN.path,
        loadComponent: () => import('./login/login.component'),
      },
      {
        path: AUTH_ROUTE_BRANCHES.REGISTER.path,
        loadComponent: () => import('./register/register.component'),
      },
      {
        path: AUTH_ROUTE_BRANCHES.FORGOT_PASSWORD.path,
        loadComponent: () => import('./forgot-password/forgot-password.page'),
      },
      {
        path: '',
        redirectTo: AUTH_ROUTE_BRANCHES.LOGIN.path,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: AUTH_ROUTE_BRANCHES.LOGIN.path,
      }
    ],
  },
];
