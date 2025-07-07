import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerModalComponent, PdfViewerModalData } from '../../components/pdf-viewer-modal/pdf-viewer-modal.component';

/**
 * Servicio responsable de abrir modales de documentos PDF
 * Sigue el principio de responsabilidad única (SRP) - solo maneja la apertura de modales PDF
 * Sigue el principio abierto/cerrado (OCP) - puede extenderse para otros tipos de modales
 */
@Injectable({
  providedIn: 'root'
})
export class PdfModalService {
  private readonly dialog = inject(MatDialog);

  /**
   * Abre un modal para visualizar un documento PDF
   * @param fileId ID del archivo
   * @param title Título opcional para el modal
   */
  openFitacPdf(fileId: string, title?: string): void {
    if (!fileId) {
      console.warn('No se puede abrir PDF: ID de archivo requerido');
      return;
    }

    const data: PdfViewerModalData = {
      fileId,
      title: title || 'Archivo FITAC'
    };

    this.dialog.open(PdfViewerModalComponent, {
      data,
      width: '95vw',
      maxWidth: '1024px',
      disableClose: false,
      autoFocus: false,
      restoreFocus: true,
      hasBackdrop: true,
      backdropClass: 'modern-backdrop',
    });
  }
}
