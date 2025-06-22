import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Datasheet, FitacStatus } from '../../../../models/fta/datasheet.interface';
import { IExpandableContent } from '../../../../models/common';
import { StatusDisplayService } from '../../../../services/common/status-display.service';
import { CustomChipComponent } from '../../../../components/custom-chip';

@Component({
  selector: 'app-datasheet-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule, CustomChipComponent],
  templateUrl: './datasheet-card.component.html',
})
export class DatasheetCardComponent implements IExpandableContent {
  datasheet= input.required<Datasheet>();

  private _isExpanded = signal(false);
  
  statusDisplay = inject(StatusDisplayService);

  toggle(): void {
    this._isExpanded.update(value => !value);
  }

  isExpanded(): boolean {
    return this._isExpanded();
  }

  trackById(index: number, item: any): any {
    return item.id;
  }

  getStatusName(status: FitacStatus): string {
    return this.statusDisplay.getStatusName(status);
  }
}
