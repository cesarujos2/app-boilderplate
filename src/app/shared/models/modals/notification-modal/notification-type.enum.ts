export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  CONFIRM = 'confirm'
}

export interface NotificationConfig {
  icon: string;
  iconColor: string;
  showCancelButton: boolean;
  showConfirmButton: boolean;
}

export const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  [NotificationType.SUCCESS]: {
    icon: 'check_circle',
    iconColor: '#4caf50',
    showCancelButton: false,
    showConfirmButton: true
  },
  [NotificationType.ERROR]: {
    icon: 'error',
    iconColor: '#f44336',
    showCancelButton: false,
    showConfirmButton: true
  },
  [NotificationType.WARNING]: {
    icon: 'warning',
    iconColor: '#ff9800',
    showCancelButton: true,
    showConfirmButton: true
  },
  [NotificationType.INFO]: {
    icon: 'info',
    iconColor: '#2196f3',
    showCancelButton: false,
    showConfirmButton: true
  },
  [NotificationType.CONFIRM]: {
    icon: 'help',
    iconColor: '#9c27b0',
    showCancelButton: true,
    showConfirmButton: true
  }
};
