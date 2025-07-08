import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Datasheet, FitacStatus } from '../../models/datasheet.interface';
import { IExpandableContent } from '../../../../models/common';
import { StatusDisplayService } from '../../services/status-display.service';
import { CustomChipComponent } from '../../../../components/custom-chip';
import { ClipboardService } from '../../../../../../shared/services/utilities';
import { MatMenuModule } from '@angular/material/menu';
import { PdfModalService } from '../../../../../../shared/services/ui/pdf-modal.service';
import { DatasheetService } from '../../services/datasheet.service';

@Component({
  selector: 'app-datasheet-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule, CustomChipComponent, MatTooltipModule, MatMenuModule],
  templateUrl: './datasheet-card.component.html',
})
export class DatasheetCardComponent implements IExpandableContent {
  readonly datasheet = input<Datasheet>();

  private _isExpanded = signal(false);

  statusDisplay = inject(StatusDisplayService);
  private clipboardService = inject(ClipboardService);
  private pdfModalService = inject(PdfModalService);
  private datasheetService = inject(DatasheetService);

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
  /**
   * Copia el ID del datasheet al clipboard y muestra un mensaje de confirmación
   * Delega la responsabilidad al ClipboardService siguiendo SRP
   */
  async copyIdToClipboard(event: Event): Promise<void> {
    event.stopPropagation(); // Evita que se active el toggle
    
    const id = this.datasheetDetails()?.id;
    if (!id) return;

    await this.clipboardService.copyId(id);
  }

  /**
   * Abre el modal para ver el archivo FITAC PDF
   * Delega la responsabilidad al PdfModalService siguiendo SRP
   */
  viewFitacFile(event: Event): void {
    event.stopPropagation(); // Evita que se active el toggle
    
    const fitacFileId = this.datasheetDetails()?.fitacFileId;
    if (!fitacFileId) {
      console.warn('No hay archivo FITAC disponible');
      return;
    }

    const projectName = this.datasheetDetails()?.projectName;
    const title = projectName ? `Archivo FITAC - ${projectName}` : 'Archivo FITAC';
    
    this.pdfModalService.openFitacPdf(fitacFileId, title);
  }

  viewFitacFileMod(event: Event, index: number): void {
    event.stopPropagation(); // Evita que se active el toggle

    const fitacMod = this.datasheetDetails()?.datasheetMods[index];
    if (!fitacMod?.fitacFileId) {
      console.warn('No hay archivo FITAC disponible');
      return;
    }

    this.pdfModalService.openFitacPdf(fitacMod.fitacFileId, "Levantamiento de observaciones FITAC");
  }

  /**
   * Verifica si el datasheet puede ser eliminado (solo si está en estado VALIDATED)
   */
  canDelete(): boolean {
    const datasheet = this.datasheet();
    return datasheet ? this.datasheetService.canDeleteDatasheet(datasheet) : false;
  }

  /**
   * Elimina el datasheet con confirmación
   */
  deleteDatasheet(event: Event): void {
    event.stopPropagation();
    
    const datasheet = this.datasheet();
    if (!datasheet) return;

    this.datasheetService.deleteDatasheetWithConfirmation(datasheet).subscribe();
  }
}
