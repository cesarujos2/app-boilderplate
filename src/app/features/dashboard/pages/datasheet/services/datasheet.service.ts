import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap, finalize, switchMap } from 'rxjs/operators';
import { DatasheetRepository } from './datasheet.repository';
import { DatasheetStore } from './datasheet.store';
import { ApiResponse } from '@core/models/api/apiResponse';
import { DatasheetRequest, DatasheetResponse, Datasheet } from '../models/datasheet.interface';
import { NotificationService } from '@shared/services/ui/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DatasheetService {
  private repository = inject(DatasheetRepository);
  private store = inject(DatasheetStore);
  private notificationService = inject(NotificationService);

  // Expone el estado del store
  readonly datasheets = this.store.datasheets;
  readonly total = this.store.total;
  readonly loading = this.store.loading;

  /**
   * Obtiene todas las fichas técnicas con filtros opcionales
   */
  getDatasheets(filters?: DatasheetRequest): Observable<ApiResponse<DatasheetResponse>> {
    this.store.setLoading(true);

    return this.repository.getDatasheets(filters || {})
      .pipe(
        tap(response => {
          this.store.setDatasheets(response.data.content);
          this.store.setTotal(response.data.total);
        }),
        catchError(err => {
          console.error('Error loading datasheets:', err);
          return EMPTY;
        }),
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Limpia el estado
   */
  clearState(): void {
    this.store.clear();
  }

  /**
   * Verifica si un datasheet puede ser eliminado (solo si está en estado VALIDATED)
   */
  canDeleteDatasheet(datasheet: Datasheet): boolean {
    return datasheet.fitacStatus === 'VALIDATED';
  }

  /**
   * Elimina datasheet con validación de estado y confirmación
   */
  deleteDatasheetWithConfirmation(datasheet: Datasheet): Observable<ApiResponse<null>> {
    // Validar estado
    if (!this.canDeleteDatasheet(datasheet)) {
      return EMPTY;
    }

    // Mostrar confirmación
    return this.notificationService.showConfirmation(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar la ficha técnica "${datasheet.projectName}"?`
    ).pipe(
      switchMap(result => {
        if (result?.confirmed) {
          return this.deleteDatasheet(datasheet.id);
        }
        return EMPTY;
      })
    );
  }

  /**
   * Elimina datasheet por ID
   * @param id ID de la ficha técnica a eliminar
   */
  deleteDatasheet(id: number): Observable<ApiResponse<null>> {
    this.store.setLoading(true);

    return this.repository.deleteDatasheet(id)
      .pipe(
        tap(() => {
          this.store.removeDatasheet(id);
        }),
        catchError(err => {
          console.error('Error deleting datasheet:', err);
          return EMPTY;
        }),
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }
}