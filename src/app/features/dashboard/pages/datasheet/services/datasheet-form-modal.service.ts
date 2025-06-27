import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ProjectTypeAcronym } from '../models/project-type.interface';
import { FormModalData, FormModalResult, FormModalMode } from '../models/form-modal.interface';
import { FormModalStrategyFactory } from './form-modal-strategy.factory';

@Injectable({
  providedIn: 'root'
})
export class DatasheetFormModalService {
  private dialog = inject(MatDialog);
  private strategyFactory = inject(FormModalStrategyFactory);

  /**
   * Abre un modal de formulario dinámico según el tipo de proyecto
   * @param projectTypeAcronym Acronimo del tipo de proyecto
   * @param mode Modo del formulario (create, edit, view)
   * @param datasheetId ID de la ficha técnica (solo para edit y view)
   * @returns Observable con el resultado del modal
   */
  openFormModal(
    projectTypeAcronym: ProjectTypeAcronym,
    mode: FormModalMode = 'create',
    datasheetId?: string
  ): Observable<FormModalResult | undefined> {
    // Validar que el tipo de proyecto esté soportado
    if (!this.isProjectTypeSupported(projectTypeAcronym)) {
      console.error(`Tipo de proyecto no soportado: ${projectTypeAcronym}`);
      return of()
    }

    // Obtener la estrategia correspondiente
    const strategy = this.strategyFactory.getStrategy(projectTypeAcronym);
    if (!strategy) {
      console.error(`No se encontró estrategia para: ${projectTypeAcronym}`);
      return of();
    }

    // Obtener la configuración del modal
    const modalConfig = strategy.getModalConfig(mode);

    // Preparar los datos para el modal
    const modalData: FormModalData = {
      mode,
      projectTypeAcronym,
      datasheetId
    };

    // Abrir el modal
    const dialogRef = this.dialog.open(
      modalConfig.component,
      {
        width: modalConfig.width,
        maxWidth: modalConfig.maxWidth,
        minWidth: modalConfig.minWidth,
        height: modalConfig.height,
        maxHeight: modalConfig.maxHeight,
        disableClose: modalConfig.disableClose,
        closeOnNavigation: modalConfig.closeOnNavigation,
        hasBackdrop: true,
        backdropClass: 'modern-backdrop',
        autoFocus: false,
        restoreFocus: true,
        data: modalData
      }
    );

    return dialogRef.afterClosed();
  }

  /**
   * Verifica si un tipo de proyecto está soportado
   * @param projectTypeAcronym Acronimo del tipo de proyecto
   * @returns true si está soportado
   */
  isProjectTypeSupported(projectTypeAcronym: ProjectTypeAcronym): boolean {
    const supportedAcronyms = this.strategyFactory.getSupportedAcronyms();
    return supportedAcronyms.includes(projectTypeAcronym);
  }

  /**
   * Obtiene la lista de tipos de proyecto soportados
   * @returns Array de acronimos soportados
   */
  getSupportedProjectTypes(): ProjectTypeAcronym[] {
    return this.strategyFactory.getSupportedAcronyms();
  }
}
