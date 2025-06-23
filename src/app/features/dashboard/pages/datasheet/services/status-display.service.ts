import { inject, Injectable } from '@angular/core';
import { FitacStatus, RequestStatus } from '../models/datasheet.interface';
import { ApiResponse } from '../../../../../core/models/api/apiResponse';
import { HttpClient } from '@angular/common/http';
import { catchError, of, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppInfoService } from '@core/services';

/**
 * Service for status lookup and display - SRP: Solo responsable del manejo de estados
 * OCP: Extensible para nuevos tipos de estado sin modificar código existente
 */
@Injectable({
  providedIn: 'root'
})
export class StatusDisplayService {
  // URL de la API del servicio de fichas técnicas
    private baseUrl = `${inject(AppInfoService).getApiUrl()}/Datasheet`;

  // Inyección del HttpClient para realizar solicitudes HTTP
  private readonly http = inject(HttpClient);

  // Estado reactivo para los estados de la solicitud
  requestStatusList = toSignal<RequestStatus[]>(this.getRequestStatus());

  /**
   * Obtiene los estados desde la API
   */
  private getRequestStatus() {
    return this.http.get<ApiResponse<RequestStatus[]>>(`${this.baseUrl}/request-status`)
      .pipe(
        map(resp => resp.data),
        catchError(err => {
          console.error('Error loading request status:', err);
          return of([]);
        })
      );
  }

  /**
   * Verifica si un estado existe
   */
  hasStatus(status: FitacStatus): boolean {
    return this.requestStatusList()?.some(s => s.key === status) || false;
  }
}
