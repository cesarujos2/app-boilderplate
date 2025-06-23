import { Injectable, signal, computed } from '@angular/core';
import { DatasheetRequest, FitacStatus } from '../models/datasheet.interface';

export interface DatasheetFilters {
  seeker: string;
  fitacStatus: FitacStatus | '';
  requestNumber: string;
  expedientNumber: string;
  consultantName: string;
  legalRepresentativeName: string;
  companyName: string;
  creationDateFrom: string;
  creationDateTo: string;
  modificationDateFrom: string;
  modificationDateTo: string;
}

/**
 * Service for managing datasheet filters - SRP: Solo responsable de la lógica de filtros
 * OCP: Extensible para nuevos tipos de filtros sin modificar código existente
 */
@Injectable({
  providedIn: 'root'
})
export class DatasheetFilterService {
  
  // Estado de filtros
  private filters = signal<DatasheetFilters>({
    seeker: '',
    fitacStatus: '',
    requestNumber: '',
    expedientNumber: '',
    consultantName: '',
    legalRepresentativeName: '',
    companyName: '',
    creationDateFrom: '',
    creationDateTo: '',
    modificationDateFrom: '',
    modificationDateTo: ''
  });

  // Estado de visibilidad de filtros avanzados
  private showAdvancedFilters = signal<boolean>(false);

  // Getters readonly
  readonly currentFilters = this.filters.asReadonly();
  readonly advancedFiltersVisible = this.showAdvancedFilters.asReadonly();

  // Computed para verificar si hay filtros activos
  readonly hasActiveFilters = computed(() => {
    const current = this.filters();
    return current.seeker.trim() !== '' ||
           current.fitacStatus.length > 0 ||
           current.requestNumber.trim() !== '' ||
           current.expedientNumber.trim() !== '' ||
           current.consultantName.trim() !== '' ||
           current.legalRepresentativeName.trim() !== '' ||
           current.companyName.trim() !== '' ||
           current.creationDateFrom !== '' ||
           current.creationDateTo !== '' ||
           current.modificationDateFrom !== '' ||
           current.modificationDateTo !== '';
  });

  // Computed para verificar si hay filtros avanzados activos
  readonly hasActiveAdvancedFilters = computed(() => {
    const current = this.filters();
    return current.requestNumber.trim() !== '' ||
           current.expedientNumber.trim() !== '' ||
           current.consultantName.trim() !== '' ||
           current.legalRepresentativeName.trim() !== '' ||
           current.companyName.trim() !== '' ||
           current.creationDateFrom !== '' ||
           current.creationDateTo !== '' ||
           current.modificationDateFrom !== '' ||
           current.modificationDateTo !== '';
  });

  /**
   * Convierte los filtros actuales a formato DatasheetRequest
   */
  toDatasheetRequest(): DatasheetRequest {
    const current = this.filters();
    const request: DatasheetRequest = {};

    if (current.seeker.trim()) {
      request.seeker = current.seeker.trim();
    }

    if (current.fitacStatus.trim()) {
      // Para múltiples estados, convertir a string separado por comas
      request.fitacStatus = current.fitacStatus.trim();
    }

    if (current.requestNumber.trim()) {
      request.requestNumber = current.requestNumber.trim();
    }

    if (current.expedientNumber.trim()) {
      request.expedientNumber = current.expedientNumber.trim();
    }

    if (current.consultantName.trim()) {
      request.consultantName = current.consultantName.trim();
    }

    if (current.legalRepresentativeName.trim()) {
      request.legalRepresentativeName = current.legalRepresentativeName.trim();
    }

    if (current.companyName.trim()) {
      request.companyName = current.companyName.trim();
    }

    if (current.creationDateFrom) {
      request.creationDateFrom = current.creationDateFrom;
    }

    if (current.creationDateTo) {
      request.creationDateTo = current.creationDateTo;
    }

    if (current.modificationDateFrom) {
      request.modificationDateFrom = current.modificationDateFrom;
    }

    if (current.modificationDateTo) {
      request.modificationDateTo = current.modificationDateTo;
    }

    return request;
  }

  /**
   * Actualiza el filtro de búsqueda (seeker)
   */
  updateSeeker(seeker: string): void {
    this.filters.update(current => ({
      ...current,
      seeker
    }));
  }

  /**
   * Actualiza los filtros de estado
   */
  updateFitacStatus(statuses: FitacStatus | ''): void {
    this.filters.update(current => ({
      ...current,
      fitacStatus: statuses
    }));
  }


  /**
   * Actualiza un filtro específico
   */
  updateFilter<K extends keyof DatasheetFilters>(key: K, value: DatasheetFilters[K]): void {
    this.filters.update(current => ({
      ...current,
      [key]: value
    }));
  }

  /**
   * Muestra/oculta filtros avanzados
   */
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update(current => !current);
  }

  /**
   * Muestra filtros avanzados
   */
  showAdvanced(): void {
    this.showAdvancedFilters.set(true);
  }

  /**
   * Oculta filtros avanzados
   */
  hideAdvanced(): void {
    this.showAdvancedFilters.set(false);
  }

  /**
   * Limpia todos los filtros
   */
  clearAll(): void {
    this.filters.set({
      seeker: '',
      fitacStatus: '',
      requestNumber: '',
      expedientNumber: '',
      consultantName: '',
      legalRepresentativeName: '',
      companyName: '',
      creationDateFrom: '',
      creationDateTo: '',
      modificationDateFrom: '',
      modificationDateTo: ''
    });
  }

  /**
   * Limpia solo los filtros avanzados
   */
  clearAdvanced(): void {
    this.filters.update(current => ({
      ...current,
      requestNumber: '',
      expedientNumber: '',
      consultantName: '',
      legalRepresentativeName: '',
      companyName: '',
      creationDateFrom: '',
      creationDateTo: '',
      modificationDateFrom: '',
      modificationDateTo: ''
    }));
  }

  /**
   * Limpia solo los filtros básicos
   */
  clearBasic(): void {
    this.filters.update(current => ({
      ...current,
      seeker: '',
      fitacStatus: ''
    }));
  }
}
