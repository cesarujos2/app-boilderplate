import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppInfoService } from '@core/services';

export interface PdfDocumentResult {
  success: boolean;
  data?: Blob;
  error?: string;
}

/**
 * Servicio responsable de la obtención de documentos PDF
 * Sigue el principio de responsabilidad única (SRP) - solo maneja documentos PDF
 * Sigue el principio abierto/cerrado (OCP) - puede extenderse para otros tipos de documentos
 */
@Injectable({
  providedIn: 'root'
})
export class PdfDocumentService {
  private readonly http = inject(HttpClient);
  private  readonly apiUrl = inject(AppInfoService).getApiUrl();

  /**
   * Obtiene un documento PDF por su ID
   * @param fitacFileId ID del archivo FITAC
   * @returns Observable con el resultado de la operación
   */
  getFitacPdf(fitacFileId: string): Observable<PdfDocumentResult> {
    if (!fitacFileId) {
      return of({
        success: false,
        error: 'ID de archivo requerido'
      });
    }

    const url = `${this.apiUrl}/Home/FtaPDF?Id=${fitacFileId}`;
    
    return this.http.get(url, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    }).pipe(
      map((blob: Blob) => ({
        success: true,
        data: blob
      })),
      catchError((error) => {
        console.error('Error al obtener PDF:', error);
        
        let errorMessage = 'Error al cargar el documento';
        
        if (error.status === 404) {
          errorMessage = 'Documento no encontrado';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para ver este documento';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión';
        }

        return of({
          success: false,
          error: errorMessage
        });
      })
    );
  }

  /**
   * Convierte un Blob en una URL de objeto para mostrar en el navegador
   * @param blob Blob del PDF
   * @returns URL del objeto
   */
  createObjectUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Libera la URL de objeto creada previamente
   * @param url URL a liberar
   */
  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
