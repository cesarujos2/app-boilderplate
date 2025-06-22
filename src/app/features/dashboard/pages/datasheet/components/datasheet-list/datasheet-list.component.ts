import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasheetCardComponent } from '../datasheet-card/datasheet-card.component';
import { DatasheetService } from 'app/features/dashboard/services';

@Component({
    selector: 'app-datasheet-list',
    standalone: true,
    imports: [
        CommonModule,
        DatasheetCardComponent
    ],
    templateUrl: './datasheet-list.component.html'
})
export class DatasheetListComponent implements OnInit {
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
