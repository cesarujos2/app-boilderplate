import { CommonModule, NgIf } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { LocationsComponent } from '../locations/locations.component';
import { LocalizationComponent } from '../localization/localization.component';
import { GeneralService } from '../../services/general.service';
import { IProjectInformation } from '../../models/fta.interface';

@Component({
  selector: 'app-project-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField, MatInput, MatLabel, MatError, MatSelect, MatOption, MatPrefix,
    CommonModule,
    LocationsComponent,
    LocalizationComponent
  ],
  templateUrl: './project-data.component.html',
  styleUrl: './project-data.component.scss'
})
export class ProjectDataComponent {
  readonly generalService = inject(GeneralService)

  form = input.required<FormGroup<any>>();
  formData = input<IProjectInformation>();

  disableFields = input.required<boolean>();
  constructor() { }


  getFormArray(key: keyof IProjectInformation) {
    return this.form().get(key) as FormArray<any>;
  }

  getFormGroup(key: keyof IProjectInformation) {
    return this.form().get(key) as FormGroup<any>;
  }
}
