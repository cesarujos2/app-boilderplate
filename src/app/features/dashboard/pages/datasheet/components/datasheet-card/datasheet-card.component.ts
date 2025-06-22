import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Datasheet, FitacStatus } from '../../../../models/fta/datasheet.interface';
import { IExpandableContent } from '../../../../models/common';
import { StatusDisplayService } from '../../../../services/common/status-display.service';
import { CustomChipComponent } from '../../../../components/custom-chip';

@Component({
  selector: 'app-datasheet-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule, CustomChipComponent, MatTooltipModule],
  templateUrl: './datasheet-card.component.html',
})
export class DatasheetCardComponent implements IExpandableContent {
  readonly datasheet = input<Datasheet>();

  private _isExpanded = signal(false);

  statusDisplay = inject(StatusDisplayService);

  // Computed property to get the status of the datasheet
  datasheetDetails = computed(() => {
    const original = this.datasheet();
    if (!original) return null;

    const modifiedMods = original.datasheetMods.map(mod => {
      return {
        ...mod,
        status: this.statusDisplay.requestStatusList()?.find(s => s.key === mod.fitacStatus) || null,
      };
    });

    return {
      ...original,
      datasheetMods: modifiedMods,
      status: this.statusDisplay.requestStatusList()?.find(s => s.key === original.fitacStatus) || null,
    };
  });

  toggle(): void {
    this._isExpanded.update(value => !value);
  }

  isExpanded(): boolean {
    return this._isExpanded();
  }

  trackById(index: number, item: any): any {
    return item.id;
  }
}
