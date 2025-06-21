import { NotificationType } from './notification-type.enum';

export interface NotificationModalData {
  title: string;
  message?: string;
  html?: string;
  type?: NotificationType;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  icon?: string;
  iconColor?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancelled?: () => void;
}

export interface NotificationModalResult {
  confirmed: boolean;
  action?: string;
}

// Builder pattern para crear notificaciones de forma más fluida
export class NotificationModalBuilder {
  private data: Partial<NotificationModalData> = {};

  static create(): NotificationModalBuilder {
    return new NotificationModalBuilder();
  }

  setTitle(title: string): NotificationModalBuilder {
    this.data.title = title;
    return this;
  }
  setMessage(message?: string): NotificationModalBuilder {
    if (message) {
      this.data.message = message;
    }
    return this;
  }

  setHtml(html?: string): NotificationModalBuilder {
    if (html) {
      this.data.html = html;
    }
    return this;
  }

  setType(type: NotificationType): NotificationModalBuilder {
    this.data.type = type;
    return this;
  }

  setConfirmButtonText(text: string): NotificationModalBuilder {
    this.data.confirmButtonText = text;
    return this;
  }

  setCancelButtonText(text: string): NotificationModalBuilder {
    this.data.cancelButtonText = text;
    return this;
  }

  onConfirm(callback: () => void): NotificationModalBuilder {
    this.data.onConfirm = callback;
    return this;
  }

  onCancel(callback: () => void): NotificationModalBuilder {
    this.data.onCancelled = callback;
    return this;
  }

  build(): NotificationModalData {
    if (!this.data.title) {
      throw new Error('Title is required for notification modal');
    }
    return this.data as NotificationModalData;
  }
}