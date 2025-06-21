import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _isLoading = signal(false);

  /**
   * Estado de loading de las peticiones de autenticación
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Inicia el estado de loading
   */
  startLoading(): void {
    this._isLoading.set(true);
  }

  /**
   * Detiene el estado de loading
   */
  stopLoading(): void {
    this._isLoading.set(false);
  }

  /**
   * Ejecuta una función asíncrona mientras muestra el loading
   * @param asyncFn Función asíncrona a ejecutar
   * @returns Promise de la función ejecutada
   */
  async withLoading<T>(asyncFn: () => Promise<T>): Promise<T> {
    this.startLoading();
    try {
      return await asyncFn();
    } finally {
      this.stopLoading();
    }
  }
}
