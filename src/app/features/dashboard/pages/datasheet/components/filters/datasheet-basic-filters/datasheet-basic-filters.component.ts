import { Component, computed, inject, signal, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CustomChipComponent } from '../../../../../components/custom-chip';
import { StatusDisplayService } from '../../../services/status-display.service';
import { DatasheetFilterService } from '../../../services/datasheet-filter.service';
import { FitacStatus } from '../../../models/datasheet.interface';

/**
 * Componente de filtros básicos - SRP: Solo responsable de la UI de filtros básicos
 * OCP: Extensible para nuevos tipos de filtros básicos
 */
@Component({
  selector: 'app-datasheet-basic-filters',
  standalone: true,  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule,
    CustomChipComponent
  ],
  templateUrl: './datasheet-basic-filters.component.html',
})
export class DatasheetBasicFiltersComponent implements OnInit {
  
  filterService = inject(DatasheetFilterService);
  statusDisplayService = inject(StatusDisplayService);

  // Estado local para el input de búsqueda
  searchTerm = signal<string>('');

  // Output para notificar cambios de filtros
  filtersChanged = output<void>();

  // Computed para la lista de estados
  statusList = computed(() => this.statusDisplayService.requestStatusList());

  ngOnInit() {
    // Sincronizar con el estado del servicio
    this.searchTerm.set(this.filterService.currentFilters().seeker);
  }

  /**
   * Maneja cambios en el campo de búsqueda
   */
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.filterService.updateSeeker(value);
    this.filtersChanged.emit();
  }

  /**
   * Maneja el envío de búsqueda
   */
  onSearchSubmit(): void {
    this.filtersChanged.emit();
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.filterService.updateSeeker('');
    this.filtersChanged.emit();
  }

  /**
   * Verifica si un estado está seleccionado
   */
  isStatusSelected(status: FitacStatus): boolean {
    return this.filterService.currentFilters().fitacStatus === status;
  }

  /**
   * Alterna la selección de un estado
   */
  toggleStatus(status: FitacStatus): void {
    if (this.isStatusSelected(status)) {
      this.filterService.updateFitacStatus('');
    } else {
      this.filterService.updateFitacStatus(status);
    }
    this.filtersChanged.emit();
  }

  /**
   * Limpia los filtros de estado
   */
  clearStatusFilters(): void {
    this.filterService.updateFitacStatus('');
    this.filtersChanged.emit();
  }

  /**
   * Alterna la visibilidad de filtros avanzados
   */
  toggleAdvancedFilters(): void {
    this.filterService.toggleAdvancedFilters();
  }

  /**
   * Limpia todos los filtros
   */
  clearAllFilters(): void {
    this.filterService.clearAll();
    this.searchTerm.set('');
    this.filtersChanged.emit();
  }

  /**
   * Cuenta los filtros activos
   */
  getActiveFiltersCount(): number {
    let count = 0;
    const filters = this.filterService.currentFilters();
    
    if (filters.seeker.trim()) count++;
    if (filters.fitacStatus.length > 0) count++;
    if (filters.requestNumber.trim()) count++;
    if (filters.expedientNumber.trim()) count++;
    if (filters.consultantName.trim()) count++;
    if (filters.legalRepresentativeName.trim()) count++;
    if (filters.companyName.trim()) count++;
    if (filters.creationDateFrom) count++;
    if (filters.creationDateTo) count++;
    if (filters.modificationDateFrom) count++;
    if (filters.modificationDateTo) count++;
    
    return count;
  }
}
