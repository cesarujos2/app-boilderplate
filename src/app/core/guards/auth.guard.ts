import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../features/auth/services/account/account.service';
import { AUTH_ROUTE_BRANCHES } from 'app/features/auth/pages/auth.routes';
import { DASHBOARD_ROUTE_BRANCHES } from 'app/features/dashboard/pages/dashboard.routes';

/**
 * Guard que protege las rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAuthenticated()) {
    return true;
  }  // Si no está autenticado, redirigir al login
  router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
  
  return false;
};

/**
 * Guard que previene el acceso a rutas de autenticación cuando ya se está logueado
 * Redirige al dashboard si el usuario ya está autenticado
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (!accountService.isAuthenticated()) {
    return true;
  }

  // Si ya está autenticado, redirigir al dashboard
  router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
  return false;
};