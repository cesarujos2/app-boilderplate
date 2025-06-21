import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../features/auth/services/account/account.service';
import { DASHBOARD_ROUTE_BRANCHES } from '../../features/dashboard/pages/dashboard.routes';
import { AUTH_ROUTE_BRANCHES } from '../../features/auth/pages/auth.routes';

/**
 * Guard para rutas públicas que pueden ser accedidas por usuarios autenticados y no autenticados
 * Útil para páginas como términos y condiciones, política de privacidad, etc.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  // Las rutas públicas siempre son accesibles
  return true;
};

/**
 * Guard que redirige a la página apropiada según el estado de autenticación
 * Si está autenticado -> dashboard
 * Si no está autenticado -> login
 */
export const redirectGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAuthenticated()) {
    router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
  } else {
    console.log(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
    router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
  }
  
  return false; // Siempre redirige, nunca permite el acceso directo
};
