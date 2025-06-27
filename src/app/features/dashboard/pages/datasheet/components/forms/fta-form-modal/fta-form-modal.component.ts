import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormModalData, FormModalResult } from '../../../models/form-modal.interface';

@Component({
  selector: 'app-fta-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './fta-form-modal.component.html',
})
export class FtaFormModalComponent {
  private dialogRef = inject(MatDialogRef<FtaFormModalComponent, FormModalResult>);
  protected data = inject<FormModalData>(MAT_DIALOG_DATA);

  getTitle(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Nueva Ficha Técnica Ambiental';
      case 'edit':
        return 'Editar Ficha Técnica Ambiental';
      case 'view':
        return 'Ver Ficha Técnica Ambiental';
      default:
        return 'Ficha Técnica Ambiental';
    }
  }

  getSaveButtonText(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Crear';
      case 'edit':
        return 'Guardar';
      case 'view':
        return 'Cerrar';
      default:
        return 'Guardar';
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false
    });
  }

  onSave(): void {
    // TODO: Implementar lógica de guardado
    this.dialogRef.close({
      success: true,
      data: {
        message: 'Formulario FTA guardado exitosamente'
      }
    });
  }
}
