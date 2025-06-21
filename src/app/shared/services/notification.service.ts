import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NotificationComponent } from '../components/notification/notification.component';
import { 
  NotificationModalData, 
  NotificationModalResult, 
  NotificationModalBuilder 
} from '@shared/models/modals/notification-modal/notification-modal-data.interface';
import { NotificationType } from '@shared/models/modals/notification-modal/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private dialog: MatDialog) {}

  /**
   * Muestra una notificación de error
   */
  showError(title: string, message?: string, html?: string): Observable<NotificationModalResult> {
    const data = NotificationModalBuilder.create()
      .setTitle(title)
      .setType(NotificationType.ERROR)
      .setMessage(message)
      .setHtml(html)
      .build();

    return this.openDialog(data).afterClosed();
  }

  /**
   * Muestra una notificación de éxito
   */
  showSuccess(title: string, message?: string): Observable<NotificationModalResult> {
    const data = NotificationModalBuilder.create()
      .setTitle(title)
      .setType(NotificationType.SUCCESS)
      .setMessage(message)
      .build();

    return this.openDialog(data).afterClosed();
  }

  /**
   * Muestra una notificación de advertencia
   */
  showWarning(title: string, message?: string): Observable<NotificationModalResult> {
    const data = NotificationModalBuilder.create()
      .setTitle(title)
      .setType(NotificationType.WARNING)
      .setMessage(message)
      .build();

    return this.openDialog(data).afterClosed();
  }

  /**
   * Muestra una notificación informativa
   */
  showInfo(title: string, message?: string): Observable<NotificationModalResult> {
    const data = NotificationModalBuilder.create()
      .setTitle(title)
      .setType(NotificationType.INFO)
      .setMessage(message)
      .build();

    return this.openDialog(data).afterClosed();
  }

  /**
   * Muestra un modal de confirmación
   */
  showConfirmation(
    title: string, 
    message?: string, 
    confirmCallback?: () => void,
    cancelCallback?: () => void
  ): Observable<NotificationModalResult> {
    const builder = NotificationModalBuilder.create()
      .setTitle(title)
      .setType(NotificationType.CONFIRM)
      .setMessage(message);

    if (confirmCallback) {
      builder.onConfirm(confirmCallback);
    }

    if (cancelCallback) {
      builder.onCancel(cancelCallback);
    }

    const data = builder.build();
    return this.openDialog(data).afterClosed();
  }

  /**
   * Muestra una notificación personalizada
   */
  showCustom(data: NotificationModalData): Observable<NotificationModalResult> {
    return this.openDialog(data).afterClosed();
  }
  /**
   * Método privado para abrir el dialog
   */
  private openDialog(data: NotificationModalData): MatDialogRef<NotificationComponent> {
    return this.dialog.open(NotificationComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: data,
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });
  }

  /**
   * Cierra todos los modales abiertos
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}
