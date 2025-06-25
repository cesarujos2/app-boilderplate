import { Component, OnInit, OnChanges, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatasheetCardComponent } from '../datasheet-card/datasheet-card.component';
import { DatasheetBasicFiltersComponent } from '../filters/datasheet-basic-filters/datasheet-basic-filters.component';
import { DatasheetAdvancedFiltersComponent } from '../filters/datasheet-advanced-filters/datasheet-advanced-filters.component';
import { PaginatorComponent, PaginatorEvent } from 'app/shared/components/paginator/paginator.component';
import { DatasheetFilterService } from 'app/features/dashboard/pages/datasheet/services/datasheet-filter.service';
import { DatasheetService } from '../../services/datasheet.service';
import { ProjectTypeService } from '../../services/project-type.service';
import { ProjectTypeModalService } from '../../services/project-type-modal.service';

@Component({
    selector: 'app-datasheet-list',
    standalone: true,    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        DatasheetCardComponent,
        DatasheetBasicFiltersComponent,
        DatasheetAdvancedFiltersComponent,
        PaginatorComponent
    ],
    templateUrl: './datasheet-list.component.html'
})
export class DatasheetListComponent implements OnInit {
    private datasheetService = inject(DatasheetService);
    private filterService = inject(DatasheetFilterService);
    private projectTypeService = inject(ProjectTypeService);
    private projectTypeModalService = inject(ProjectTypeModalService);

    datasheets = computed(() => this.datasheetService.datasheets());
    loading = computed(() => this.datasheetService.loading());
    total = computed(() => this.datasheetService.total());
    
    // Computed para obtener parámetros de paginación
    currentFilters = computed(() => this.filterService.currentFilters());
    currentPage = computed(() => this.currentFilters().page);
    currentPageSize = computed(() => this.currentFilters().pageSize);

    projectTypes = computed(() => this.projectTypeService.projectTypes());

    ngOnInit() {
        this.loadDatasheets();
        this.loadProjectTypes();
    }

    /**
     * Carga las fichas técnicas aplicando los filtros actuales
     */
    private loadDatasheets(): void {
        const filters = this.filterService.toDatasheetRequest();
        this.datasheetService.getDatasheets(filters).subscribe();
    }

    /*
    * Carga los tipos de proyecto filtrados por el rol del usuario
    */

    private loadProjectTypes(): void {
        this.projectTypeService.getProjectTypes().subscribe();
    }

    /**
     * Maneja cambios en los filtros
     */
    onFiltersChanged(): void {
        // Resetear a la primera página cuando cambian los filtros
        this.filterService.resetToFirstPage();
        this.loadDatasheets();
    }

    /**
     * Maneja cambios en la paginación
     */
    onPageChange(event: PaginatorEvent): void {
        this.filterService.updatePagination(event.page, event.pageSize);
        this.loadDatasheets();
    }    /**
     * Maneja el click del botón para agregar nueva ficha técnica
     * Abre el modal de selección de tipo de proyecto
     */
    onAddDatasheet(): void {
        this.projectTypeModalService.openProjectTypeSelectionModal(this.projectTypes())
            .subscribe(result => {
                if (result) {
                    console.log('Tipo de proyecto seleccionado:', result.selectedProjectType);
                    // Aquí se puede continuar con la lógica para crear la ficha técnica
                }
            });
    }
}
