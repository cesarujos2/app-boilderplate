import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { FtaService } from '../../services/fta.service';
import { ICoordinatesUTM } from '../../models/fta.interface';
import { UTMAsyncValidator } from '../../validators/UTMAsyncValidator';

@Component({
  selector: 'app-utm',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconButton, MatIcon, MatTooltip, MatMiniFabButton,
    MatFormField, MatInput, MatError, MatLabel, MatSelect, MatOption
  ],
  templateUrl: './utm.component.html',
  styleUrl: './utm.component.scss'
})
export class UtmComponent implements OnInit {
  readonly fb = inject(FormBuilder)
  readonly ftaService = inject(FtaService)
  form = input.required<FormArray<any>>();
  formData = input<ICoordinatesUTM[]>();

  constructor() {
    effect(() => {
      if (this.formData()) {
        this.form().clear();
        this.formData()?.forEach(data => this.addUTMFormWithData(data))
      }
    })
  }


  ngOnInit(): void {
    this.addUTMForm();
    this.form().addAsyncValidators(UTMAsyncValidator(this.ftaService))
  }

  get utmForms() {
    return this.form().controls as FormGroup[]
  }

  addUTMForm(event?: MouseEvent) {
    if (event) event.preventDefault();
    if (this.form().valid) {
      this.form().push(this.fb.group<{ [key in keyof ICoordinatesUTM]: any }>({
        zone: ['', Validators.required],
        easting: ['', [Validators.required, Validators.pattern(/^\d{1,6}(\.\d+)?$/)]],
        northing: ['', [Validators.required, Validators.pattern(/^\d{1,7}(\.\d+)?$/)]],
      }));
    } else {
      this.form().markAllAsTouched()
    }
  }

  addUTMFormWithData(data: ICoordinatesUTM) {
    this.form().push(this.fb.group<{ [key in keyof ICoordinatesUTM]: any }>({
      zone: [data.zone, Validators.required],
      easting: [data.easting, [Validators.required, Validators.pattern(/^\d{1,6}(\.\d+)?$/)]],
      northing: [data.northing, [Validators.required, Validators.pattern(/^\d{1,7}(\.\d+)?$/)]],
    }));
  }

  removeUTMForm(index: number) {
    this.form().removeAt(index);
  }

}

