import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ApiResponse } from "app/core/models/api/apiResponse";
import { Observable } from "rxjs";
import { IUserStorageService, LocalStorageUserService } from './user-storage.service';
import { tap } from 'rxjs/operators';
import { LoginRequest } from "../../models/Account/login-request.interface";
import { LoginResponse } from "../../models/Account/login-response.interface";
import { Account } from "../../models/Account/account.interface";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private API_URL = `https://localhost:7083/api/Account`;
    private readonly http = inject(HttpClient);
    private readonly userStorage = inject<IUserStorageService>(LocalStorageUserService);

    readonly user = signal<Account | null>(null);

    login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                if (response.success && response.data) {
                    this.userStorage.setUser(response.data as Account);
                }
            })
        );
    }
}