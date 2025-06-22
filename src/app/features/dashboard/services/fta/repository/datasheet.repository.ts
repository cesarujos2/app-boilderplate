import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api/apiResponse';
import { DatasheetResponse } from '../../../models/fta/datasheet.interface';
import { DatasheetRequest } from '../../../models/fta';

/**
 * Repository Service - SRP: Solo responsable del acceso a datos
 */
@Injectable({
  providedIn: 'root'
})
export class DatasheetRepository {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7083/api/Fta';

  getDatasheets(filters: DatasheetRequest): Observable<ApiResponse<DatasheetResponse>> {
    const params = this.buildHttpParams(filters);
    return this.http.get<ApiResponse<DatasheetResponse>>(`${this.baseUrl}/datasheets`, { params });
  }

  private buildHttpParams(filters: DatasheetRequest): HttpParams {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
