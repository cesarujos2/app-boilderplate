import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasheetCardComponent } from '../datasheet-card/datasheet-card.component';
import { DatasheetBasicFiltersComponent } from '../filters/datasheet-basic-filters/datasheet-basic-filters.component';
import { DatasheetAdvancedFiltersComponent } from '../filters/datasheet-advanced-filters/datasheet-advanced-filters.component';
import { DatasheetFilterService } from 'app/features/dashboard/pages/datasheet/services/datasheet-filter.service';
import { DatasheetService } from '../../services/datasheet.service';

@Component({
    selector: 'app-datasheet-list',
    standalone: true,    imports: [
        CommonModule,
        DatasheetCardComponent,
        DatasheetBasicFiltersComponent,
        DatasheetAdvancedFiltersComponent
    ],
    templateUrl: './datasheet-list.component.html'
})
export class DatasheetListComponent implements OnInit {
    private datasheetService = inject(DatasheetService);
    private filterService = inject(DatasheetFilterService);

    datasheets = computed(() => this.datasheetService.datasheets());
    loading = computed(() => this.datasheetService.loading());

    ngOnInit() {
        this.loadDatasheets();
    }

    /**
     * Carga las fichas técnicas aplicando los filtros actuales
     */
    private loadDatasheets(): void {
        const filters = this.filterService.toDatasheetRequest();
        this.datasheetService.getDatasheets(filters).subscribe();
    }

    /**
     * Maneja cambios en los filtros
     */
    onFiltersChanged(): void {
        this.loadDatasheets();
    }
}
