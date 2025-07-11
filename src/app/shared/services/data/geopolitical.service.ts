import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppInfoService } from '@core/services';
import { Ubigeo } from '@shared/models/general/ubigeo.interface';
import { catchError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeopoliticalService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${inject(AppInfoService).getApiUrl()}/GeneralData`;

    departments = toSignal(this.getDepartments(), { initialValue: [] });


    getDepartments() {
        return this.http.get<Ubigeo[]>(`${this.apiUrl}/ListDepartments`).pipe(
            catchError(() => {
                return [];
            })
        );
    }

    listProvinces(departmentId: string) {
        return this.http.get<Ubigeo[]>(`${this.apiUrl}/ListProvinces/${departmentId}`).pipe(
            catchError(() => {
                return [];
            })
        );
    }

    listDistricts(provinceId: string) {
        return this.http.get<Ubigeo[]>(`${this.apiUrl}/ListDistricts/${provinceId}`).pipe(
            catchError(() => {
                return [];
            })
        );
    }
}