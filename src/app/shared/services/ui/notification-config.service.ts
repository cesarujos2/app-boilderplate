import { Injectable } from '@angular/core';
import { NotificationModalData, NotificationModalResult } from '@shared/models/modals/notification-modal/notification-modal-data.interface';
import { NotificationConfig, NOTIFICATION_CONFIGS, NotificationType } from '@shared/models/modals/notification-modal/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationConfigService {

  getConfigForType(type: NotificationType): NotificationConfig {
    return NOTIFICATION_CONFIGS[type];
  }

  mergeWithTypeConfig(data: NotificationModalData): NotificationModalData {
    if (!data.type) {
      return data;
    }

    const typeConfig = this.getConfigForType(data.type);
    
    return {
      ...data,
      icon: data.icon ?? typeConfig.icon,
      iconColor: data.iconColor ?? typeConfig.iconColor,
      showCancelButton: data.showCancelButton ?? typeConfig.showCancelButton,
      showConfirmButton: data.showConfirmButton ?? typeConfig.showConfirmButton,
      confirmButtonText: data.confirmButtonText ?? this.getDefaultConfirmText(data.type),
      cancelButtonText: data.cancelButtonText ?? this.getDefaultCancelText(data.type)
    };
  }

  private getDefaultConfirmText(type: NotificationType): string {
    const confirmTexts: Record<NotificationType, string> = {
      [NotificationType.SUCCESS]: 'Aceptar',
      [NotificationType.ERROR]: 'Entendido',
      [NotificationType.WARNING]: 'Continuar',
      [NotificationType.INFO]: 'Aceptar',
      [NotificationType.CONFIRM]: 'Sí'
    };
    
    return confirmTexts[type];
  }

  private getDefaultCancelText(type: NotificationType): string {
    const cancelTexts: Record<NotificationType, string> = {
      [NotificationType.SUCCESS]: 'Cerrar',
      [NotificationType.ERROR]: 'Cerrar',
      [NotificationType.WARNING]: 'Cancelar',
      [NotificationType.INFO]: 'Cerrar',
      [NotificationType.CONFIRM]: 'No'
    };
    
    return cancelTexts[type];
  }
}
