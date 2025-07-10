import { AdminSideBarService } from './../../services/admin-side-bar.service';
import { NotificationService } from 'app/shared/services/ui/notification.service';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskComponent } from './components/task/task.component';
import { MatCardModule } from '@angular/material/card';
import { TasksService } from './service/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScheduledTask } from './models/tasks.interface';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ExecutionDetailsComponent } from './components/execution-details/execution-details.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatButtonModule, MatIconModule,
    TaskComponent,
    MatCardModule
  ],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export default class TasksComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly adminSideBarService = inject(AdminSideBarService);
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog);

  selectedIndex = signal<number>(0);

  actions = toSignal(this.tasksService.getActions(), { initialValue: [] });
  selectedActionId = computed(() => this.actions()[this.selectedIndex()]?.id ?? -1);

  //scheduledTasks = toSignal(this.tasksService.getScheduledTasks(), { initialValue: [] });
  scheduledTasks = signal<ScheduledTask[]>([]);
  scheduledTasksByIdSelected = computed(() => this.scheduledTasks().filter(task => task.actionId === this.selectedActionId()));

  deletingTaskIds = signal<Set<number>>(new Set());

  constructor() {
    this.tasksService.getScheduledTasks().subscribe((tasks) => {
      this.scheduledTasks.set(tasks);
    });
  }

  addScheduledTask() {
    this.dialog.open<AddTaskComponent, { actionId: number }, ScheduledTask>(AddTaskComponent, {
      width: '400px',
      data: {
        actionId: this.selectedActionId(),
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.scheduledTasks.set([...this.scheduledTasks(), result]);
      }
    })
  }

  deleteScheduledTask(taskId: number | null) {
    this.notificationService.showWarning(
      'Confirmar eliminación', '¿Estás seguro de que quieres eliminar esta tarea programada?'
    ).subscribe((result) => {
      if (!result.confirmed) return;
      if (taskId === null) return;
      const current = new Set(this.deletingTaskIds());
      current.add(taskId);
      this.deletingTaskIds.set(current);

      setTimeout(() => {
        this.scheduledTasks.set(
          this.scheduledTasks().filter(task => task.id !== taskId)
        );

        const updated = new Set(this.deletingTaskIds());
        updated.delete(taskId);
        this.deletingTaskIds.set(updated);
        this.tasksService.deleteScheduledTask(taskId).subscribe();
      }, 300);
    });
  }

  onChangeTaskDataItem(task: ScheduledTask) {
    const tasks = this.scheduledTasks().map(t => t.id === task.id ? task : t);
    this.scheduledTasks.set(tasks);
    this.tasksService.updateScheduledTask(task).subscribe();
  }

  onDetailsClick(id: number | null) {
    if (id === null) return;
    this.dialog.open<ExecutionDetailsComponent, { scheduledTaskId: number }, ScheduledTask>(ExecutionDetailsComponent, {
      width: '90%',
      minWidth: '300px',
      maxWidth: '750px',
      maxHeight: '900px',
      data: {
        scheduledTaskId: id,
      }
    });
  }

  toggleSideBar() {
    this.adminSideBarService.toggle();
  }
}
