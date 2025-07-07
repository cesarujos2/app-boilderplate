import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { GeneralService } from '../../../services/general.service';
import { IEnviromentalMeasure } from '../../../models/fta.interface';

@Component({
  selector: 'app-add-env-measure',
  standalone: true,
  imports: [
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatButton,
    ReactiveFormsModule,
    MatLabel, MatFormField, MatSelect, MatOption, MatError, MatInput,
    CommonModule
  ],
  templateUrl: './add-env-measure.component.html',
  styleUrl: './add-env-measure.component.scss'
})
export class AddEnvMeasureComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef);
  readonly generalService = inject(GeneralService);
  readonly fb = inject(FormBuilder);

  data = inject<IAddEnvMeasure>(MAT_DIALOG_DATA);
  form: FormGroup = this.fb.group({});

  constructor() { }

  ngOnInit(): void {
    this.form = this.fb.group<{ [key in keyof IEnviromentalMeasure]: any }>({
      selected: [true],
      code: ['new'],
      stage: [this.data.stage.code],
      activities: ['', [Validators.required, Validators.maxLength(250)]],
      component: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      preventiveMeasures: ['', [Validators.required, Validators.maxLength(250)]],
      frecuency: ['', [Validators.required, Validators.maxLength(250)]],
      verification: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  addNewEnvMeasure() {
    if (this.form.valid) {
      this.data.form.push(this.form);
      this.dialogRef.close(true);
    } else {
      this.form.markAllAsTouched();
    }
  }
}

export interface IAddEnvMeasure {
  stage: {
    code: string,
    label: string,
  }
  form: FormArray,
}