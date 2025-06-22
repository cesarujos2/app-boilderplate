import { Datasheet, DatasheetResponse, FitacStatus, StatusRequest } from './../../models/fta/datasheet.interface';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiResponse } from '@core/models/api/apiResponse';
import { DatasheetRequest } from '../../models/fta';

@Injectable({
  providedIn: 'root'
})
export class DatasheetService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7083/api/Fta';

  // Estado reactivo para las fichas
  private datasheetList = signal<Datasheet[]>([]);

  private totalDatasheets = signal<number>(0);

  /**
   * Obtiene todas las fichas técnicas con filtros opcionales
   */
  getDatasheets(filters?: DatasheetRequest): Observable<ApiResponse<DatasheetResponse>> {
    let params = this.getHttpParams(filters || {});

    return this.http.get<ApiResponse<DatasheetResponse>>(`${this.baseUrl}/datasheets`, { params })
      .pipe(
        tap(response => {
          this.datasheetList.set(response.data.content);
          this.totalDatasheets.set(response.data.total);
        }),
        catchError(err => {
          return EMPTY;
        })
      );
  }

  getRequestStatus() {
    return this.http.get<ApiResponse<StatusRequest[]>>(`${this.baseUrl}/request-status`)
      .pipe(
        map(response => response.data),
        catchError(err => {
          return of([]);
        }));
  }

  private getHttpParams(filters: DatasheetRequest): HttpParams {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }


  /**
   * Utility method para obtener el color del estado
   */
  getStatusColor(status: FitacStatus): string {
    const statusColors: { [key in FitacStatus]: string } = {
      'UNDER_REVIEW': 'warning',
      'RESOLVED': 'success',
      'REJECTED': 'error',
      'PENDING': 'info',
      'APPROVED': 'success'
    };
    return statusColors[status] || 'default';
  }

  /**
   * Utility method para obtener el texto del estado en español
   */
  getStatusText(status: FitacStatus): string {
    const statusTexts: { [key in FitacStatus]: string } = {
      'UNDER_REVIEW': 'En Revisión',
      'RESOLVED': 'Resuelto',
      'REJECTED': 'Rechazado',
      'PENDING': 'Pendiente',
      'APPROVED': 'Aprobado'
    };
    return statusTexts[status] || status;
  }
}
