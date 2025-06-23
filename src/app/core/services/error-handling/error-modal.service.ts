import { Injectable } from '@angular/core';

/**
 * Servicio para controlar modales de error activos
 * Implementa SRP - Single Responsibility Principle (solo maneja estado de modales)
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  private readonly activeErrorModals = new Set<number>();

  /**
   * Verifica si se puede mostrar un modal para un status de error
   * @param errorStatus Status HTTP del error (ej: 401, 500, etc.)
   */
  canShowModal(errorStatus: number): boolean {
    return !this.activeErrorModals.has(errorStatus);
  }

  /**
   * Marca un modal como activo (se está mostrando)
   * @param errorStatus Status HTTP del error
   */
  showModal(errorStatus: number): void {
    this.activeErrorModals.add(errorStatus);
  }

  /**
   * Marca un modal como cerrado (usuario hizo click en cerrar)
   * @param errorStatus Status HTTP del error
   */
  closeModal(errorStatus: number): void {
    this.activeErrorModals.delete(errorStatus);
  }

  /**
   * Obtiene todos los modales activos (para debugging)
   */
  getActiveModals(): number[] {
    return Array.from(this.activeErrorModals);
  }

  /**
   * Limpia todos los modales activos (útil en logout)
   */
  clearAllModals(): void {
    this.activeErrorModals.clear();
  }
}
