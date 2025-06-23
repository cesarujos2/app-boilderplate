import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, computed, signal, input, output, linkedSignal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface PaginatorEvent {
    page: number;
    pageSize: number;
}

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [
        CommonModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
    ],
    templateUrl: './paginator.component.html'
})
export class PaginatorComponent {
    total = input<number>(0);
    page = model<number>(1);
    pageSize = model<number>(10);
    pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);
    showFirstLastButtons = input<boolean>(true);
    showPageSizeSelector = input<boolean>(true);
    disabled = input<boolean>(false);

    pageChanged = output<PaginatorEvent>();

    totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

    startItem = computed(() => {
        if (this.total() === 0) return 0;
        return (this.page() - 1) * this.pageSize() + 1;
    });

    endItem = computed(() => {
        const end = this.page() * this.pageSize();
        return Math.min(end, this.total());
    });

    canGoPrevious = computed(() => this.page() > 1 && !this.disabled());
    canGoNext = computed(() => this.page() < this.totalPages() && !this.disabled());


    onPageSizeChange(newPageSize: number): void {
        if (this.disabled()) return;

        this.pageSize.set(newPageSize);
        this.page.set(1); // Reset to first page when changing page size
        this.emitPageChange();
    }

    goToPage(page: number): void {
        if (this.disabled() || page < 1 || page > this.totalPages()) return;

        this.page.set(page);
        this.emitPageChange();
    }

    goToFirstPage(): void {
        this.goToPage(1);
    }

    goToLastPage(): void {
        this.goToPage(this.totalPages());
    }

    goToPreviousPage(): void {
        this.goToPage(this.page() - 1);
    }

    goToNextPage(): void {
        this.goToPage(this.page() + 1);
    }

    private emitPageChange(): void {
        this.pageChanged.emit({
            page: this.page(),
            pageSize: this.pageSize()
        });
    }
}
