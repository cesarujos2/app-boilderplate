import { Component, inject, signal, output, OnInit, effect, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatasheetFilterService, DatasheetFilters } from '../../../services/datasheet-filter.service';

/**
 * Componente de filtros avanzados - SRP: Solo responsable de la UI de filtros avanzados
 * OCP: Extensible para nuevos tipos de filtros avanzados
 */
@Component({
  selector: 'app-datasheet-advanced-filters',
  standalone: true, imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './datasheet-advanced-filters.component.html',
})
export class DatasheetAdvancedFiltersComponent {

  filterService = inject(DatasheetFilterService);

  // Outputs
  filtersChanged = output<void>();

  // Filtros avanzados
  requestNumber = linkedSignal(() => this.filterService.currentFilters().requestNumber);
  expedientNumber = linkedSignal(() => this.filterService.currentFilters().expedientNumber);
  consultantName = linkedSignal(() => this.filterService.currentFilters().consultantName);
  legalRepresentativeName = linkedSignal(() => this.filterService.currentFilters().legalRepresentativeName);
  companyName = linkedSignal(() => this.filterService.currentFilters().companyName);
  creationDateFrom = linkedSignal(() => this.filterService.currentFilters().creationDateFrom);
  creationDateTo = linkedSignal(() => this.filterService.currentFilters().creationDateTo);
  modificationDateFrom = linkedSignal(() => this.filterService.currentFilters().modificationDateFrom);
  modificationDateTo = linkedSignal(() => this.filterService.currentFilters().modificationDateTo);

  /**
  * Actualiza un filtro en el servicio - DRY principle
  */
  updateFilter<K extends keyof DatasheetFilters>(field: K, value: string | Date | null): void {
    if (value instanceof Date) {
      this.filterService.updateFilter(field, value.toISOString() as DatasheetFilters[K]);
    } else {
      this.filterService.updateFilter(field, (value || '') as DatasheetFilters[K]);
    }
  }

  /**
   * Aplica los filtros
   */
  applyFilters(): void {
    this.filtersChanged.emit();
  }

  /**
   * Limpia los filtros avanzados
   */
  clearAdvancedFilters(): void {
    this.filterService.clearAdvanced();
    this.filtersChanged.emit();
  }

  /**
   * Cierra los filtros avanzados
   */
  closeAdvancedFilters(): void {
    this.filterService.hideAdvanced();
  }
}
