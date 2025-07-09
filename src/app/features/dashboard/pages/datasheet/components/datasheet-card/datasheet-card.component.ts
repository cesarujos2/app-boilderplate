import { ChangeStatusOrchestratorService } from './../../services/change-status-orchestrator.service';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
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
import { AccountService } from 'app/features/auth/services';
import { DatasheetFilterService } from '../../services/datasheet-filter.service';
import { finalize } from 'rxjs';

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
  private accountService = inject(AccountService);
  private changeStatusOrchestratorService = inject(ChangeStatusOrchestratorService);
  private filterService = inject(DatasheetFilterService);

  // Computed property to get the status of the datasheet
  datasheetDetails = linkedSignal(() => {
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

  //Is loading signal
  isLoading = signal(false);

  canTransition() {
    const datasheet = this.datasheetDetails();
    if (!datasheet || !datasheet.status?.userRole) return false;
    if (!this.accountService.hasRole(datasheet.status.userRole)) return false;
    if (datasheet.datasheetMods.length > 0) return false;
    return true;
  }

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
     * Carga las fichas técnicas aplicando los filtros actuales
     */
  private loadDatasheets(): void {
    const filters = this.filterService.toDatasheetRequest();
    this.datasheetService.getDatasheets(filters).subscribe();
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

  canModTransition(index: number): boolean {
    const datasheet = this.datasheetDetails();
    if (!datasheet) return false;
    const mod = datasheet.datasheetMods[index];
    if (!mod || !mod.status?.userRole) return false;
    if (mod.fitacStatus !== 'FOR_SIGNATURE') return false;
    if (!this.accountService.hasRole(mod.status.userRole)) return false;
    return true;
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

  /**
   * Aplica la transición de estado disponible para este datasheet
   * Utiliza el nuevo sistema de transiciones con handlers especializados
   */
  applyTransition(): void {
    const datasheet = this.datasheet();
    const status = this.datasheetDetails()?.status;

    if (!datasheet || !status) {
      console.warn('No hay datasheet o estado disponible');
      return;
    }
    // Asignar loading a true para indicar que se está procesando la transición
    this.isLoading.set(true);
    // Ejecutar la transición usando el orchestrator
    this.changeStatusOrchestratorService.applyTransition(datasheet, status).pipe(
      // Al finalizar, establecer loading a false
      finalize(() => this.isLoading.set(false))
    ).subscribe(resp => {
      if (resp.success) {
        this.loadDatasheets(); // Recargar las fichas técnicas después de aplicar la transición
      }
    })
  }

  applyModTransition(modIndex: number): void {
    const datasheet = this.datasheet();
    if (!datasheet) {
      console.warn('No hay datasheet disponible para aplicar la transición de mod');
      return;
    }
    this.changeStatusOrchestratorService.applyModForSignatureTransition(datasheet, modIndex).subscribe( resp =>{
      if (resp.success) {
        this.loadDatasheets();
      }
    });
  }
}
