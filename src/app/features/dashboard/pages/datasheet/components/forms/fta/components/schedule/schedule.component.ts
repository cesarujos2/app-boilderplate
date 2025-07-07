
import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { StageNamePipe } from '../../pipes/stage-name.pipe';
import { GeneralService } from '../../services/general.service';
import { ICronoBudget, IFTA } from '../../models/fta.interface';
import { STAGES } from '../../config/fta.config';
import { dateOutOfRangeValidator } from '../../validators/dateOutOfRangeValidator';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../adapters/dateAdapter';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    StageNamePipe,
    MatFormField, MatLabel, MatInputModule, MatError,
    MatDatepickerModule,
    MatIcon, MatTooltipModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  readonly generalService = inject(GeneralService);
  readonly fb = inject(FormBuilder);
  ftaForm = input.required<FormGroup<{ [key in keyof IFTA]: FormGroup<any> }>>();

  lifeTime = signal(0);
  stages = STAGES

  constructor() {
    effect(() => {
      const stages = this.generalService.initialData().stages
      if (stages) {
        this.getArrayForm('cronoBudget')?.clear();
        stages.map(x => {
          this.addForm({
            stage: x.code
          })
        })
      }
    });

    effect(() => {
      if (this.lifeTime() > 0) {
        const controlOperation = this.cronoBudgetControls.find(x => x.get('stage')?.value === this.stages.operation.code)
        if (controlOperation) {
          this.addYears(controlOperation)
        }
      }
    })
  }
  ngOnInit() {
    this.ftaForm().get('projectInformation')?.get('lifetime')?.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(x => {
        this.lifeTime.set(x)
      })
  }

  get form() {
    return this.ftaForm().get('schedule') as FormGroup
  }

  getArrayForm(key: string) {
    return this.form?.get(key) as FormArray
  }

  get cronoBudgetControls() {
    return this.getArrayForm('cronoBudget')?.controls as FormGroup<{ [key in keyof ICronoBudget]: any }>[]
  }

  addForm(data?: ICronoBudget) {
    const cronoBudget = this.getArrayForm('cronoBudget');
    if (!cronoBudget) return;

    const form = this.fb.group<{ [key in keyof ICronoBudget]: any }>({
      stage: [null, [Validators.required]],
      startDate: [null, [Validators.required, dateOutOfRangeValidator()]],
      endDate: [null, [Validators.required, dateOutOfRangeValidator()]],
      budget: [null, [Validators.required, Validators.min(0.01), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    });

    const startDateControl = form.get('startDate');

    if (startDateControl) {
      startDateControl.valueChanges.pipe(
        distinctUntilChanged(),
      ).subscribe(newStartDate => {
        const index = cronoBudget.controls.indexOf(form);

        if (index > 0) {
          const prevForm = cronoBudget.at(index - 1);
          const prevEndDate = prevForm.get('endDate');
          if (prevEndDate) {
            prevEndDate.setValue(newStartDate, { emitEvent: false });
            prevEndDate.updateValueAndValidity();
          }
        }

        if (index === this.cronoBudgetControls.length - 1) {
          form.get('endDate')?.setValidators([
            Validators.required,
            dateOutOfRangeValidator(newStartDate instanceof Date ? newStartDate : null)
          ]);
          form.get('endDate')?.updateValueAndValidity();

        }

        cronoBudget.controls.forEach((control, i) => {
          if (i > index && newStartDate) {
            const nextStartDate = control.get('startDate');
            if (nextStartDate) {
              nextStartDate.setValidators([
                Validators.required,
                dateOutOfRangeValidator(newStartDate instanceof Date ? newStartDate : null)
              ]);
              nextStartDate.updateValueAndValidity();
            }
          }
        });
      });
    }

    cronoBudget.push(form);
    if (data) form.patchValue(data);
  }


  startDateFilter(d: Date | null): boolean {
    if (!d) return false;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return currentDate <= d;
  }

  onDateChange(i: number, event: MatDatepickerInputEvent<Date>) {
    const form = this.cronoBudgetControls[i];
    if (form.get('stage')?.value == this.stages.operation.code) {
      this.addYears(form);
    }
  }

  addYears(form: FormGroup<{ [key in keyof ICronoBudget]: any }>) {
    const date = form.get('startDate')?.value;
    if (date && date instanceof Date) {
      const i = this.cronoBudgetControls.indexOf(form)
      const newDate = new Date(date);
      newDate.setFullYear(date.getFullYear() + Number(this.lifeTime()));
      this.cronoBudgetControls[i + 1]?.get('startDate')?.setValue(newDate)
    }
  }
}
