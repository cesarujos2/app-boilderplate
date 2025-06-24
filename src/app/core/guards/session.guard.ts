import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../features/auth/services/account/account.service';
import { catchError, map, of } from 'rxjs';
import { AUTH_ROUTE_BRANCHES } from '../../features/auth/pages/auth.routes';

/**
 * Guard que valida la sesión con el servidor
 * Útil para rutas críticas que necesitan verificar que las cookies siguen siendo válidas
 */
export const sessionValidGuard: CanActivateFn = (route, state) => {
    const accountService = inject(AccountService);
    const router = inject(Router);

    // Validar sesión con el servidor
    return accountService.validateSession().pipe(
        map(response => {
            if (response.success && response.data.roles.length > 0) {
                return true;
            } else {
                accountService.forceLogout();
                router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
                return false;
            }
        }), catchError(error => {
            console.error('Error validating session:', error);
            accountService.forceLogout();
            router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
            return of(false);
        })
    );
};

/**
 * Guard especial que desloguea al usuario automáticamente
 * Útil para rutas como '/logout' que automáticamente cierran sesión
 */
export const logoutGuard: CanActivateFn = (route, state) => {
    const accountService = inject(AccountService);

    // Intentar logout con el servidor, si falla hacer logout local
    accountService.logout().pipe(
        catchError(() => {
            accountService.forceLogout();
            return of(null);
        })
    ).subscribe();

    return false; // No permitir acceso a la ruta, solo ejecutar logout
};
