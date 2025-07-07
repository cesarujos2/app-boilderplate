import { NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FtaService } from '../../services/fta.service';
import { ICoordinatesGeo } from '../../models/fta.interface';
import { GEOAsyncValidator } from '../../validators/GEOAsyncValidator';

@Component({
  selector: 'app-geo',
  standalone: true,
  imports: [
    NgFor, NgIf,
    ReactiveFormsModule,
    MatLabel, MatFormField, MatInput, MatError,
    MatMiniFabButton, MatIcon, MatTooltip, MatIconButton
  ],
  templateUrl: './geo.component.html',
  styleUrl: './geo.component.scss'
})
export class GeoComponent implements OnInit {
  readonly fb = inject(FormBuilder)
  readonly ftaService = inject(FtaService)
  form = input.required<FormArray<any>>();
  formData = input<ICoordinatesGeo[]>();

  constructor(){
    effect(() => {
      if(this.formData()){
        this.form().clear();
        this.formData()?.forEach(data => this.addGeoFormWithData(data))
      }
    })
  }

  ngOnInit(): void {
    this.addGeoForm();
    this.form().addAsyncValidators(GEOAsyncValidator(this.ftaService))
  }

  get geoForms() {
    return this.form().controls as FormGroup[]
  }

  addGeoForm(event?: MouseEvent) {
    if (event) event.preventDefault();
    if (this.form().valid) {
      this.form().push(this.fb.group<{ [key in keyof ICoordinatesGeo]: any }>({
        lat: ['', [Validators.required, Validators.pattern(/^(-?[1-8]?\d(\.\d+)?|90(\.0+)?)$/)]],
        lng: ['', [Validators.required, Validators.pattern(/^(-?(1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/)]],
      }));
    } else {
      this.form().markAllAsTouched()
    }
  }

  addGeoFormWithData(data: ICoordinatesGeo) {
    this.form().push(this.fb.group<{ [key in keyof ICoordinatesGeo]: any }>({
      lat: [data.lat, [Validators.required, Validators.pattern(/^(-?[1-8]?\d(\.\d+)?|90(\.0+)?)$/)]],
      lng: [data.lng, [Validators.required, Validators.pattern(/^(-?(1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/)]],
    }));
  }

  removeGeoForm(index: number) {
    this.form().removeAt(index);
  }

}
