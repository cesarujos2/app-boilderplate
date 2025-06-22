import { Component, OnInit, computed, inject } from '@angular/core';
import { DatasheetService } from '../../services/fta/datasheet.service';
import { CommonModule } from '@angular/common';
import { DatasheetCardComponent } from './components';

@Component({
    selector: 'app-datasheet-page',
    standalone: true,
    imports: [
        CommonModule,
        DatasheetCardComponent
    ],
    templateUrl: './datasheet.page.html'
})
export class DatasheetPageComponent implements OnInit {
    private datasheetService = inject(DatasheetService);

    datasheets = computed(() => this.datasheetService.datasheets());
    loading = computed(() => this.datasheetService.loading());

    ngOnInit() {
        this.loadDatasheets();
    }

    private loadDatasheets(): void {
        this.datasheetService.getDatasheets().subscribe();
    }
}
