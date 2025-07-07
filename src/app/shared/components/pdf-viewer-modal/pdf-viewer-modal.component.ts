import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PdfDocumentService, PdfDocumentResult } from '../../services/data/pdf-document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface PdfViewerModalData {
  fileId: string;
  title?: string;
}

/**
 * Componente modal para visualizar documentos PDF
 * Sigue el principio de responsabilidad única (SRP) - solo se encarga de mostrar PDFs
 * Sigue el principio de inversión de dependencias (DIP) - depende de abstracciones
 */
@Component({
  selector: 'app-pdf-viewer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './pdf-viewer-modal.component.html',
})
export class PdfViewerModalComponent implements OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<PdfViewerModalComponent>);
  private readonly pdfService = inject(PdfDocumentService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly data = inject<PdfViewerModalData>(MAT_DIALOG_DATA);

  // Señales para el estado del componente
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly pdfUrl = signal<SafeResourceUrl | null>(null);

  private currentObjectUrl: string | null = null;

  constructor() {
    this.loadPdf();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Carga el PDF desde el servicio
   */
  private loadPdf(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cleanup(); // Limpiar URL anterior si existe

    this.pdfService.getFitacPdf(this.data.fileId).subscribe({
      next: (result: PdfDocumentResult) => {
        this.isLoading.set(false);
        
        if (result.success && result.data) {
          this.currentObjectUrl = this.pdfService.createObjectUrl(result.data);
          if (this.currentObjectUrl) {
            const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentObjectUrl);
            this.pdfUrl.set(safeUrl);
          }
        } else {
          this.errorMessage.set(result.error || 'Error desconocido');
        }
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error inesperado al cargar el documento');
        console.error('Error en PdfViewerModal:', error);
      }
    });
  }

  /**
   * Reintenta cargar el PDF
   */
  retryLoad(): void {
    this.loadPdf();
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Descarga el PDF
   */
  downloadPdf(): void {
    if (this.currentObjectUrl) {
      const link = document.createElement('a');
      link.href = this.currentObjectUrl;
      link.download = `fitac-${this.data.fileId}.pdf`;
      link.click();
    }
  }

  /**
   * Abre el PDF en una nueva pestaña
   */
  openInNewTab(): void {
    if (this.currentObjectUrl) {
      window.open(this.currentObjectUrl, '_blank');
    }
  }

  /**
   * Limpia los recursos utilizados
   */
  private cleanup(): void {
    if (this.currentObjectUrl) {
      this.pdfService.revokeObjectUrl(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}
