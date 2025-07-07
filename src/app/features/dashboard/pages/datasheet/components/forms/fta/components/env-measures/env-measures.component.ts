import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EnvMeasuresSectionComponent } from '../env-measures-section/env-measures-section.component';
import { IFTA } from '../../models/fta.interface';
import { STAGES } from '../../config/fta.config';

@Component({
  selector: 'app-env-measures',
  standalone: true,
  imports: [
    EnvMeasuresSectionComponent
  ],
  templateUrl: './env-measures.component.html',
  styleUrl: './env-measures.component.scss'
})
export class EnvMeasuresComponent implements OnInit {
  readonly fb = inject(FormBuilder);

  ftaForm = input.required<FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>>();

  infraestrutureTypeCode = signal<string>('');
  stages = STAGES

  constructor() { }

  ngOnInit(): void {
    this.ftaForm().get('technicalDescriptions')?.get('infraestrutureType')?.valueChanges.pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).subscribe(x => {
      x ? this.infraestrutureTypeCode.set(x) : this.infraestrutureTypeCode.set('')
    })
  }

  get form(): FormGroup<{ [key in keyof typeof STAGES]: any }> {
    return this.ftaForm().get('measures')?.get('enviromentMeasures') as FormGroup<{ [key in keyof typeof STAGES]: any }>;
  }

  getFormGroup(key: keyof typeof STAGES) {
    return this.form.get(key) as FormArray;
  }
}
