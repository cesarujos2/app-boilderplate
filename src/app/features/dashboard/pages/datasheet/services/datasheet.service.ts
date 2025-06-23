import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { DatasheetRepository } from './datasheet.repository';
import { DatasheetStore } from './datasheet.store';
import { ApiResponse } from '@core/models/api/apiResponse';
import { DatasheetRequest, DatasheetResponse } from '../models/datasheet.interface';
/**
 * Main Service - SRP: Solo responsable de coordinar repository y store
 * DIP: Depende de abstracciones (repository y store inyectados)
 */
@Injectable({
  providedIn: 'root'
})
export class DatasheetService {
  private repository = inject(DatasheetRepository);
  private store = inject(DatasheetStore);

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
}