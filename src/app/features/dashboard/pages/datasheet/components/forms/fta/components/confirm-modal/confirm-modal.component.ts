import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, NgIf, MatIcon],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  safeHtml: SafeHtml | null = null;
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmModalData,
    private sanitizer: DomSanitizer
  ) {
    if (data.html) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data.html);
    }
  }

  onConfirmClick(): void {
    if (this.data.onConfirm) {
      this.data.onConfirm();
    }
    this.dialogRef.close(true);
  }

  onDismissClick(): void {
    if (this.data.onCancelled) {
      this.data.onCancelled();
    }
    this.dialogRef.close(false);
  }
}

export interface ConfirmModalData {
  title: string;
  message?: string;
  html?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  icon?: string;
  iconColor?: string;
  onConfirm?: () => void;
  onCancelled?: () => void;
}
