import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, viewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { map, take } from 'rxjs';
import { AddEnvMeasureComponent, IAddEnvMeasure } from './add-env-measure/add-env-measure.component';
import { MatError } from '@angular/material/form-field';
import { ComponentNamePipe } from '../../pipes/component-name.pipe';
import { MasterService } from '../../services/master.service';
import { STAGES } from '../../config/fta.config';
import { envMeasureAdapter } from '../../adapters/envMeasuresAdapter';
import { IEnviromentalMeasure } from '../../models/fta.interface';

@Component({
  selector: 'app-env-measures-section',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule,
    CommonModule, SlicePipe,
    MatSlideToggleModule,
    MatIconButton, MatIcon, MatButton,
    MatError,
    ComponentNamePipe
  ],
  templateUrl: './env-measures-section.component.html',
  styleUrl: './env-measures-section.component.scss'
})
export class EnvMeasuresSectionComponent {
  readonly masterService = inject(MasterService);
  readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog)

  infoItems = viewChildren<ElementRef<HTMLDivElement>>('infoItem');

  form = input.required<FormArray>();
  stage = input.required<(typeof STAGES)[keyof typeof STAGES]>();
  infraestrutureTypeCode = input.required<string>();

  fields = fields;

  constructor() {
    effect(() => {
      this.getEnvMeasures()
    })
  }

  getEnvMeasures() {
    if (this.infraestrutureTypeCode().length > 0) {
      this.masterService.listEnviromentalMeasures(this.stage().code, this.infraestrutureTypeCode())
        .pipe(
          take(1),
          map(d => { return envMeasureAdapter(d.enviromentalMeasures) })
        )
        .subscribe(x => {
          this.removeAllPredefinedMeasures();
          x.forEach(t => this.addFormGroup(t));
        })
    }
  }

  removeAllPredefinedMeasures(){
    for (let i = this.envMeasureForms.length - 1; i >= 0; i--) {
      const formGroup = this.envMeasureForms[i];
    
      if (formGroup.get('code')?.value !== 'new') {
        this.form().removeAt(i);
      }
    }
  }

  get envMeasureForms() {
    return this.form().controls as FormGroup[]
  }

  addFormGroup(measure?: IEnviromentalMeasure) {
    const measureControl = this.fb.group<{ [key in keyof IEnviromentalMeasure]: any }>({
      selected: [false],
      code: ['new'],
      stage: [''],
      activities: [''],
      component: [''],
      description: [''],
      preventiveMeasures: [''],
      frecuency: [''],
      verification: ['']
    });
    if (measure) measureControl.patchValue(measure);
    this.form().push(measureControl)
  }

  showInfoItem(i: number) {
    this.infoItems().forEach((section, index) => {
      if (index == i && section.nativeElement.classList.contains('--invisible')) {
        section.nativeElement.classList.remove("--invisible")
      } else {
        section.nativeElement.classList.add("--invisible")
      }
    })
  }

  isExpanded(i: number): boolean {
    const item = this.infoItems()[i];
    return item ? !item.nativeElement.classList.contains('--invisible') : false;
  }

  addEnvMeasure() {
    this.dialog.open<AddEnvMeasureComponent, IAddEnvMeasure, boolean>(AddEnvMeasureComponent, {
      width: '95%',
      height: '450px',
      minWidth: '300px',
      maxWidth: '600px',
      disableClose: true,
      data: {
        stage: this.stage(),
        form: this.form(),
      }
    })
  }
}

const fields = [
  { key: 'activities', label: 'Actividad' },
  { key: 'component', label: 'Componente' },
  { key: 'description', label: 'Descripción del Impacto' },
  { key: 'frecuency', label: 'Frecuencia' },
  { key: 'verification', label: 'Medio de Verificación' }
];

