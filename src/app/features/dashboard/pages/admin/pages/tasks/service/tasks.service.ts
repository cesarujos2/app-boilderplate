import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Actions, ExecutionCount, ResolutionDocument, ScheduledTask } from '../models/tasks.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private API_URL = `${environment.API.URL}/TaskExecution`;
  private http = inject(HttpClient)

  constructor() { }

  getActions(): Observable<Actions[]> {
    return this.http.get<Actions[]>(`${this.API_URL}/actions`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching actions:', error);
          return of([]);
        })
      );
  }

  getScheduledTasks(): Observable<ScheduledTask[]> {
    return this.http.get<ScheduledTask[]>(`${this.API_URL}/scheduled`)
      .pipe(
        map((tasks: ScheduledTask[]) => {
          return tasks.map(task => ({
            ...task,
            time: task.time ? new Date(task.time) : new Date(),
            days: task.days || []
          }));
        }),
        catchError((error) => {
          console.error('Error fetching scheduled tasks:', error);
          return of([]);
        })
      );
  }

  updateScheduledTask(task: ScheduledTask): Observable<ScheduledTask> {
    return this.http.post<ScheduledTask>(`${this.API_URL}/scheduled`, task)
      .pipe(
        map((response: ScheduledTask) => {
          return {
            ...response,
            time: response.time ? new Date(response.time) : new Date(),
            days: response.days || []
          };
        }),
        catchError((error) => {
          console.error('Error updating scheduled task:', error);
          return of(task);
        })
      );
  }

  deleteScheduledTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/scheduled/${taskId}/delete`, {})
      .pipe(
        catchError((error) => {
          console.error('Error deleting scheduled task:', error);
          return of();
        })
      );
  }

  getExecutionCount(scheduledTaskId: number): Observable<ExecutionCount[]> {
    return this.http.get<ExecutionCount[]>(`${this.API_URL}/scheduled/${scheduledTaskId}/executions`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching execution count:', error);
          return of([]);
        })
      );
  }

  getDocumentsForExecution(executionNumberId: number): Observable<ResolutionDocument[]> {
    return this.http.get<ResolutionDocument[]>(`${this.API_URL}/executions/${executionNumberId}/documents`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching documents for task:', error);
          return of([]);
        })
      );
  }
}
