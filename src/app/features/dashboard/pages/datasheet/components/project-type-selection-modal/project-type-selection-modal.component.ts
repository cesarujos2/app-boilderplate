import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProjectType } from '../../models/project-type.interface';
import { ProjectTypeSelectionModalData, ProjectTypeSelectionModalResult } from '../../models/project-type-selection-modal-data.interface';

@Component({
  selector: 'app-project-type-selection-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './project-type-selection-modal.component.html',
  styleUrl: './project-type-selection-modal.component.scss'
})
export class ProjectTypeSelectionModalComponent {
  private dialogRef = inject(MatDialogRef<ProjectTypeSelectionModalComponent, ProjectTypeSelectionModalResult>);
  protected data = inject<ProjectTypeSelectionModalData>(MAT_DIALOG_DATA);

  selectedProjectType: ProjectType | null = null;

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedProjectType) {
      this.dialogRef.close({
        selectedProjectType: this.selectedProjectType
      });
    }
  }

  isConfirmDisabled(): boolean {
    return !this.selectedProjectType;
  }
}
