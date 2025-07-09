import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { 
  PasswordConfirmationData, 
  PasswordConfirmationResult 
} from '../../services/password-confirmation-modal.service';

/**
 * Componente modal para confirmación con contraseña
 * Implementa SRP: Solo se encarga de la UI de confirmación con contraseña
 */
@Component({
  selector: 'app-password-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './password-confirmation-modal.component.html',
})
export class PasswordConfirmationModalComponent {
  private readonly dialogRef = inject(MatDialogRef<PasswordConfirmationModalComponent>);
  private readonly formBuilder = inject(FormBuilder);
  
  readonly data: PasswordConfirmationData = inject(MAT_DIALOG_DATA);
  readonly isSubmitting = signal(false);

  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onConfirm(): void {
    if (this.passwordForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      const result: PasswordConfirmationResult = {
        confirmed: true,
        password: this.passwordForm.value.password
      };

      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    const result: PasswordConfirmationResult = {
      confirmed: false
    };
    
    this.dialogRef.close(result);
  }
}
