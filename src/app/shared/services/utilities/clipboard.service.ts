import { Injectable, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for clipboard operations with user feedback
 * SRP: Solo responsable de operaciones de clipboard y notificaciones
 * OCP: Extensible para diferentes tipos de contenido
 * DIP: Abstrae las dependencias de clipboard y notificaciones
 */
@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Copia texto al clipboard y muestra feedback al usuario
   * @param text Texto a copiar
   * @param successMessage Mensaje personalizado de éxito (opcional)
   * @param errorMessage Mensaje personalizado de error (opcional)
   * @returns Promise<boolean> - true si la copia fue exitosa
   */
  async copyText(
    text: string, 
    successMessage?: string, 
    errorMessage?: string
  ): Promise<boolean> {
    if (!text) {
      this.showNotification(errorMessage || 'No hay contenido para copiar', 'error');
      return false;
    }

    try {
      const success = this.clipboard.copy(text);
      
      if (success) {
        this.showNotification(
          successMessage || `Texto copiado al portapapeles`, 
          'success'
        );
        return true;
      } else {
        this.showNotification(
          errorMessage || 'Error al copiar el texto', 
          'error'
        );
        return false;
      }
    } catch (error) {
      this.showNotification(
        errorMessage || 'Error al copiar el texto', 
        'error'
      );
      return false;
    }
  }

  /**
   * Copia un ID específico con mensaje personalizado
   * @param id ID a copiar
   * @returns Promise<boolean>
   */
  async copyId(id: string | number): Promise<boolean> {
    return this.copyText(
      id.toString(),
      `Identificador ${id} copiado al portapapeles`,
      'Error al copiar el identificador'
    );
  }

  /**
   * Muestra notificación al usuario
   * @param message Mensaje a mostrar
   * @param type Tipo de notificación
   */
  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snack-${type}`]
    });
  }
}
