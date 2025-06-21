import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SafeHtml } from '@angular/platform-browser';
import { NotificationModalData, NotificationModalResult } from '@shared/models/modals/notification-modal/notification-modal-data.interface';
import { HtmlSanitizerService } from '@shared/services/html-sanitizer.service';
import { NotificationConfigService } from '@shared/services/notification-config.service';

@Component({
    selector: 'app-notification-modal',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatIcon],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
    private readonly dialogRef = inject(MatDialogRef<NotificationComponent>);
    readonly data = inject(MAT_DIALOG_DATA) as NotificationModalData;
    private readonly htmlSanitizer = inject(HtmlSanitizerService);
    private readonly configService = inject(NotificationConfigService);
    safeHtml: SafeHtml | null = null;
    processedData: NotificationModalData;

    constructor() {
        this.processedData = this.configService.mergeWithTypeConfig(this.data);
    }

    ngOnInit(): void {
        this.initializeHtmlContent();
    }

    private initializeHtmlContent(): void {
        if (this.processedData.html) {
            if (this.htmlSanitizer.isHtmlSafe(this.processedData.html)) {
                this.safeHtml = this.htmlSanitizer.sanitizeHtml(this.processedData.html);
            } else {
                console.warn('Unsafe HTML content detected, falling back to message');
                this.processedData.html = undefined;
            }
        }
    }

    onConfirmClick(): void {
        const result: NotificationModalResult = {
            confirmed: true,
            action: 'confirm'
        };

        this.executeCallback(this.processedData.onConfirm);
        this.dialogRef.close(result);
    }

    onDismissClick(): void {
        const result: NotificationModalResult = {
            confirmed: false,
            action: 'cancel'
        };

        this.executeCallback(this.processedData.onCancelled);
        this.dialogRef.close(result);
    }

    private executeCallback(callback?: () => void): void {
        try {
            callback?.();
        } catch (error) {
            console.error('Error executing notification callback:', error);
        }
    }
}