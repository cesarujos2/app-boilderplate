import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ApiResponse } from "app/core/models/api/apiResponse";
import { Observable } from "rxjs";
import { IUserStorageService, LocalStorageUserService } from './user-storage.service';
import { tap } from 'rxjs/operators';
import { LoginRequest } from "../../models/Account/login-request.interface";
import { LoginResponse } from "../../models/Account/login-response.interface";
import { Account } from "../../models/Account/account.interface";
import { Router } from "@angular/router";
import { AUTH_ROUTE_BRANCHES } from "../../pages/auth.routes";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private API_URL = `https://localhost:7083/api/Account`;
    private readonly http = inject(HttpClient);
    private readonly userStorage = inject<IUserStorageService>(LocalStorageUserService);
    private readonly router = inject(Router);

    readonly user = signal<Account | null>(this.userStorage.getUser());

    constructor() {
        // Inicializar el signal con el usuario almacenado
        const storedUser = this.userStorage.getUser();
        if (storedUser) {
            this.user.set(storedUser);
        }
    }

    login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                if (response.success && response.data) {
                    const account = response.data as Account;
                    this.userStorage.setUser(account);
                    this.user.set(account);
                }
            })
        );
    }

    /**
     * Verifica si el usuario está actualmente autenticado
     */
    isAuthenticated(): boolean {
        return this.user() !== null;
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser(): Account | null {
        return this.user();
    }

    /**
     * Cierra la sesión del usuario
     */
    logout(): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.API_URL}/logout`, {}).pipe(
            tap(() => {
                this.forceLogout();
            })
        );
    }

    /**
     * Fuerza el logout local (sin llamada al servidor)
     */
    forceLogout(): void {
        this.userStorage.removeUser();
        this.user.set(null);
        this.router.navigate(AUTH_ROUTE_BRANCHES.LOGIN.fullPath());
    }

    /**
     * Verifica si el usuario tiene un rol específico
     */
    hasRole(role: string): boolean {
        const user = this.user();
        return user?.roles?.includes(role) || false;
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     */
    hasAnyRole(roles: string[]): boolean {
        return roles.some(role => this.hasRole(role));
    }

    /**
     * Verifica si el usuario es administrador
     */
    isAdmin(): boolean {
        return this.user()?.isAdmin || false;
    }

    /**
     * Verifica la sesión con el servidor (para validar cookies)
     */
    validateSession(): Observable<ApiResponse<Account>> {
        return this.http.post<ApiResponse<Account>>(`${this.API_URL}/validate-session`, {}).pipe(
            tap(response => {
                if (response.success && response.data) {
                    const account = response.data;
                    this.userStorage.setUser(account);
                    this.user.set(account);
                } else {
                    // Sesión inválida, limpiar datos locales
                    this.forceLogout();
                }
            })
        );
    }
}