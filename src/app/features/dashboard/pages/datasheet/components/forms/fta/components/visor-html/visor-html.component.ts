import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visor-html',
  standalone: true,
  imports: [],
  templateUrl: './visor-html.component.html',
  styleUrl: './visor-html.component.scss'
})
export class VisorHtmlComponent {
  urlSafe: SafeResourceUrl;  
  
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<VisorHtmlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UrlData,
  ){
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onDismissClick(): void {
    this.dialogRef.close(false);
  }
}

export interface UrlData {
  url: string;
}

