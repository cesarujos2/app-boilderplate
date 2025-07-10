import { Component, inject, model, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TasksService } from '../../service/tasks.service';
import { ScheduledTask } from '../../models/tasks.interface';
import { DayWeekPickerComponent } from '@shared/components/day-week-picker/day-week-picker.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { skip } from 'rxjs';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DayWeekPickerComponent,
    MatSlideToggleModule,
    MatTimepickerModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly taskService = inject(TasksService);

  taskForm: FormGroup<{ [key in keyof ScheduledTask]: any }>;

  initalData = model.required<ScheduledTask>()
  onChange = output<ScheduledTask>()

  validChange = output<boolean>();

  constructor() {
    this.taskForm = this.createTaskForm();
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.initalData());
    this.taskForm.valueChanges
    .pipe(skip(1))
    .subscribe(value => {
      this.initalData.set(value as ScheduledTask);
      this.onChange.emit(value as ScheduledTask);
    });

    this.taskForm.statusChanges
    .pipe(skip(1))
    .subscribe(status => {
      this.validChange.emit(status === 'VALID');
    });
  }

  private createTaskForm(): FormGroup<{ [key in keyof ScheduledTask]: any }> {
    return this.fb.group<{
      [key in keyof ScheduledTask]: any
    }>({
      id: [null],
      time: [null, Validators.required],
      actionId: [null, Validators.required],
      days: [[] as number[], [Validators.required, Validators.minLength(1)]],
      isActive: [false],
    })
  }

}

