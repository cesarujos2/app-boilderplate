import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { AccountService } from '../account/account.service';
import { LoginRequest } from '../../models/account/login-request.interface';
import { LoginResponse } from '../../models/account/login-response.interface';
import { ApiResponse } from 'app/core/models/api/apiResponse';
import { RoleCompletionService } from '../profile-completion/role-completion.service';

/**
 * Servicio coordinador que maneja el flujo completo de login
 * Siguiendo el principio de responsabilidad única y composición
 */
@Injectable({
    providedIn: 'root'
})
export class LoginCoordinatorService {
    private readonly accountService = inject(AccountService);
    private readonly roleCompletionService = inject(RoleCompletionService);

    /**
     * Ejecuta el flujo completo de login incluyendo completion de perfil si es necesario
     */
    executeLogin(request: LoginRequest): Observable<boolean> {
        return this.accountService.login(request).pipe(
            switchMap((response: ApiResponse<LoginResponse>) => {
                if (!response.success || !response.data) {
                    return throwError(() => new Error(response.message || 'Error en el login'));
                }

                const loginData = response.data;

                // Si requiere completar rol, mostrar modal
                if (this.accountService.requiredRole(loginData)) {
                    return this.roleCompletionService.handleRoleCompletion();
                }

                // Login exitoso sin necesidad de completar rol
                return new Observable<boolean>(observer => {
                    observer.next(true);
                    observer.complete();
                });
            })
        );
    }

    executeValidateSession(): Observable<boolean> {
        return this.accountService.validateSession().pipe(
            switchMap((response: ApiResponse<LoginResponse>) => {
                if (!response.success || !response.data) {
                    return throwError(() => new Error(response.message || 'Error al validar sesión'));
                }
                const loginData = response.data;
                
                // Si requiere completar rol, mostrar modal
                if (this.accountService.requiredRole(loginData)) {
                    return this.roleCompletionService.handleRoleCompletion();
                }

                return new Observable<boolean>(observer => {
                    observer.next(true);
                    observer.complete();
                })
            })
        )
    }
}
