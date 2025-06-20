import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Account } from "app/core/models/api/Account/account.interface";
import { LoginRequest } from "app/core/models/api/Account/login-request.interface";
import { LoginResponse } from "app/core/models/api/Account/login-response.interface";
import { ApiResponse } from "app/core/models/api/apiResponse";
import { Observable } from "rxjs";
import { IUserStorageService, LocalStorageUserService } from './user-storage.service';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private API_URL = `https://localhost:7083/api/Account`;
    private readonly http = inject(HttpClient);
    private readonly userStorage: IUserStorageService;

    readonly user = signal<LoginRequest | null>(null);

    constructor() {
        this.userStorage = new LocalStorageUserService();
    }

    login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                if (response.success && response.data) {
                    this.setUser(response.data as Account);
                }
            })
        );
    }

    setUser(account: Account): void {
        this.userStorage.setUser(account);
    }

    getUser(): Account | null {
        return this.userStorage.getUser();
    }

    removeUser(): void {
        this.userStorage.removeUser();
    }
}