/**
 * Authentication routes using the new centralized routing system
 * Clean, simple route definitions without circular dependencies
 */
import { Routes } from '@angular/router';
import AuthPage from './auth.page';
import { LoginComponent, RegisterComponent, ForgotPasswordComponent } from '@features';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      }
    ],
  },
];
