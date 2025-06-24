import { Component, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileCompletionModalData, RoleSelectionData } from '../../models/role-selection-modal/role-selection.interface';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-profile-completion-modal',
    standalone: true,    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './profile-completion-modal.component.html',
})
export class ProfileCompletionModalComponent {
    dialogRef = inject(MatDialogRef<ProfileCompletionModalComponent>);
    data = inject(MAT_DIALOG_DATA) as ProfileCompletionModalData;    roleControl = new FormControl('', [Validators.required]);
    documentInscription = new FormControl<File | null>(null);
    fileInputDisplayName = '';

    constructor() {
        // Observar cambios en el rol para actualizar validaciones
        this.roleControl.valueChanges.subscribe(role => {
            if (role === 'legal') {
                this.documentInscription.setValidators([Validators.required]);
            } else {
                this.documentInscription.clearValidators();
                this.documentInscription.setValue(null);
                this.fileInputDisplayName = '';
            }
            this.documentInscription.updateValueAndValidity();
        });
    }


    getRoleIcon(role: string): string {
        const icons: Record<string, string> = {
            'legal': 'gavel',
            'consultor': 'business_center'
        };
        return icons[role] || 'person';
    }

    getRoleDisplayName(role: string): string {
        const names: Record<string, string> = {
            'legal': 'Legal',
            'consultor': 'Consultor'
        };
        return names[role] || role;
    }    getRoleDescription(role: string): string {
        const descriptions: Record<string, string> = {
            'legal': 'Persona que representa a una empresa autorizada para desarrollo de proyectos de telecomunicaciones',
            'consultor': 'Persona que elabora instrumentos de gestión ambiental'
        };
        return descriptions[role] || 'Descripción no disponible';
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            
            // Validar que sea un archivo PDF
            if (file.type !== 'application/pdf') {
                input.value = '';
                this.documentInscription.setValue(null);
                this.fileInputDisplayName = 'Solo se permiten archivos PDF';
                return;
            }
            
            this.documentInscription.setValue(file);
            this.fileInputDisplayName = file.name;
        }
    }

    onConfirm(): void {
        if (this.roleControl.valid && this.documentInscription.valid) {
            const result: RoleSelectionData = {
                selectedRole: this.roleControl.value!,
                documentInscription: this.documentInscription.value
            };
            this.dialogRef.close(result);
        }
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }
}
