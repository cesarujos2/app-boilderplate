import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TaskComponent } from '../task/task.component';
import { TasksService } from '../../service/tasks.service';
import { ScheduledTask } from '../../models/tasks.interface';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatDialogTitle, MatDialogActions, MatDialogContent,
    MatButton,
    TaskComponent
],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  readonly taskService = inject(TasksService);
  readonly diaglogRef = inject(MatDialogRef<AddTaskComponent>);
  readonly data = inject<{ actionId: number }>(MAT_DIALOG_DATA);

  private getNextHalfHour(): Date {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes <= 30 ? 30 : 0;
    const nextHour = minutes > 30 ? now.getHours() + 1 : now.getHours();
    
    const nextHalfHour = new Date(now);
    nextHalfHour.setHours(nextHour, roundedMinutes, 0, 0);
    
    return nextHalfHour;
  }

  taskData = signal<ScheduledTask>({
    id: null,
    time: this.getNextHalfHour(),
    actionId: this.data.actionId,
    days: [],
    isActive: false
  });
  
  isValid = signal<boolean>(false);

  addTask(){
    if (this.isValid()) {
      this.taskService.updateScheduledTask(this.taskData()).subscribe(resp => {
        this.diaglogRef.close(resp);
      });
    } else {
      this.diaglogRef.close(null);
    }
  }
}
