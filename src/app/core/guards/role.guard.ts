import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../features/auth/services/account/account.service';
import { AUTH_ROUTE_BRANCHES } from '../../features/auth/pages/auth.routes';
import { DASHBOARD_ROUTE_BRANCHES } from '../../features/dashboard/pages/dashboard.routes';

/**
 * Guard que verifica roles específicos del usuario
 * Útil para proteger rutas que requieren permisos especiales
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const accountService = inject(AccountService);
    const router = inject(Router);    // Primero verificar si está autenticado
    if (!accountService.isAuthenticated()) {
      router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
      return false;
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasPermission = accountService.hasAnyRole(allowedRoles);

    if (!hasPermission) {
      // Redirigir a una página de acceso denegado o al dashboard
      router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
      return false;
    }

    return true;
  };
};

/**
 * Guard que verifica si el usuario es administrador
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  // Primero verificar si está autenticado
  if (!accountService.isAuthenticated()) {
    router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
    return false;
  }

  // Verificar si es administrador
  if (!accountService.isAdmin()) {
    // Redirigir al dashboard si no es admin
    router.navigate(DASHBOARD_ROUTE_BRANCHES.BASE.fullPath());
    return false;
  }

  return true;
};
