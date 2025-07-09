import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PasswordConfirmationModalComponent } from '../components/password-confirmation-modal/password-confirmation-modal.component';

/**
 * Datos del modal de confirmación con contraseña
 */
export interface PasswordConfirmationData {
  title: string;
  message: string;
  placeholder?: string;
}

/**
 * Resultado del modal de confirmación con contraseña
 */
export interface PasswordConfirmationResult {
  confirmed: boolean;
  password?: string;
}

/**
 * Servicio para mostrar modales de confirmación con contraseña
 * Implementa SRP: Solo se encarga de manejar modales de contraseña
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordConfirmationModalService {
  private readonly dialog = inject(MatDialog);

  /**
   * Solicita confirmación con contraseña al usuario
   * @param title Título del modal
   * @param message Mensaje a mostrar
   * @param placeholder Placeholder para el campo de contraseña
   * @returns Observable con el resultado
   */
  requestPassword(
    title: string, 
    message: string, 
    placeholder: string = 'Ingrese su contraseña'
  ): Observable<PasswordConfirmationResult | undefined> {
    const dialogRef: MatDialogRef<PasswordConfirmationModalComponent, PasswordConfirmationResult> = 
      this.dialog.open(PasswordConfirmationModalComponent, {
        width: '400px',
        maxWidth: '90vw',
        disableClose: true,
        closeOnNavigation: false,
        autoFocus: true,
        restoreFocus: true,
        data: {
          title,
          message,
          placeholder
        } as PasswordConfirmationData
      });

    return dialogRef.afterClosed();
  }

  /**
   * Cierra todos los modales de confirmación abiertos
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}
