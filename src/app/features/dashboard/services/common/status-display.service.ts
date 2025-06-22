import { inject, Injectable } from '@angular/core';
import { RequestStatus } from '../../models/fta';
import { FitacStatus } from '../../models/fta/datasheet.interface';
import { ApiResponse } from '../../../../core/models/api/apiResponse';
import { HttpClient } from '@angular/common/http';
import { catchError, of, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Service for status lookup and display - SRP: Solo responsable del manejo de estados
 * OCP: Extensible para nuevos tipos de estado sin modificar código existente
 */
@Injectable({
  providedIn: 'root'
})
export class StatusDisplayService {
  private readonly baseUrl = 'https://localhost:7083/api/Fta';
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
   * Obtiene el nombre de visualización para un estado
   */
  getStatusName(status: FitacStatus): string {
    const statusItem = this.requestStatusList()?.find(s => s.key === status);
    return statusItem?.name || 'Desconocido';
  }

  /**
   * Verifica si un estado existe
   */
  hasStatus(status: FitacStatus): boolean {
    return this.requestStatusList()?.some(s => s.key === status) || false;
  }
}
