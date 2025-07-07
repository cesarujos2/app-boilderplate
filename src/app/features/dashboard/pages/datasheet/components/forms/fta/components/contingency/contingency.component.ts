import { Component, effect, inject, input, NgModule, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs';
import { FtaService } from '../../services/fta.service';
import { IContingencyMeasure, IFTA } from '../../models/fta.interface';
import { CommonModule } from '@angular/common';
import { contMeasureAdapter } from '../../adapters/contMeasureAdapter';

@Component({
  selector: 'app-contingency',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggle,
    MatError,
    CommonModule,
    FormsModule, 
    MatInput, 
    MatFormField, 
    MatLabel, 
    MatError,
    MatIcon
  ],
  templateUrl: './contingency.component.html',
  styleUrl: './contingency.component.scss'
})
export class ContingencyComponent {
  readonly fb = inject(FormBuilder);
  readonly ftaService = inject(FtaService);

  ftaForm = input.required<FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>>();

  infraestrutureTypeCode = signal<string>('');

  allChecked = signal(false)

  constructor() {
    effect(() => {
      this.getContMeasures()
    })
  }

  ngOnInit(): void {
    this.ftaForm().get('technicalDescriptions')?.get('infraestrutureType')?.valueChanges.pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).subscribe(x => {
      x ? this.infraestrutureTypeCode.set(x) : this.infraestrutureTypeCode.set('')
    })
  }

  getContMeasures() {
    if (this.infraestrutureTypeCode().length > 0) {
      this.ftaService.getContingencyMeasures(this.infraestrutureTypeCode())
        .pipe(
          take(1),
          map(d => { return contMeasureAdapter(d.contingencyMeasures) })
        )
        .subscribe(x => {
          this.allChecked.set(false);
          this.form.clear();
          x.forEach(t => this.addFormGroup(t));
        })
    }
  }

  addFormGroup(measure: IContingencyMeasure) {
    const measureForm = this.fb.group<{ [key in keyof IContingencyMeasure]: any }>({
      selected: [false, [Validators.requiredTrue]],
      code: [''],
      risk: [''],
      contingencyMeasure: ['', [Validators.required, Validators.maxLength(500)]]
    })
    if (measure) measureForm.patchValue(measure)
    this.form.push(measureForm)
  }

  get form(): FormArray {
    return this.ftaForm().get('measures')?.get('contingencyMeasures') as FormArray;
  }
  get contMeasureForms() {
    return this.form.controls as FormGroup[]
  }

  splitted(value?: string) {
    return value ? value.trim().split(/\.\s+/g) : [];
  }

  onToggleChange(): void {
    this.allChecked.set(this.contMeasureForms.every(x => (x instanceof FormGroup) && x.get('selected')?.value === true))
  }

  allToggleChange(event: MatSlideToggleChange) {
    this.contMeasureForms.forEach(x => {
      x.get('selected')?.setValue(event.checked)
    })
  }
}
