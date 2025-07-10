import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DocumentDataComponent } from '../document-data/document-data.component';
import { TasksService } from '../../service/tasks.service';
import { DateFormatterPipe } from '../../pipes/date-formatter.pipe';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [
    MatButton, MatIconButton,
    MatIcon, MatDialogClose,
    DateFormatterPipe,
    MatDialogModule
],
  templateUrl: './execution-details.component.html',
  styleUrl: './execution-details.component.scss'
})
export class ExecutionDetailsComponent {
  private readonly dialog = inject(MatDialog);
  readonly data = inject<{ scheduledTaskId: number }>(MAT_DIALOG_DATA);
  
  readonly tasksService = inject(TasksService);

  executionCount = toSignal(this.tasksService.getExecutionCount(this.data.scheduledTaskId), { initialValue: [] });

  openDocumentsDetails(executionNumberId: number): void {
    this.dialog.open<DocumentDataComponent, { executionNumberId: number }, any>(DocumentDataComponent, {
      width: '90%',
      minWidth: '300px',
      maxWidth: '650px',
      maxHeight: '800px',
      data: {
        executionNumberId: executionNumberId
      }
    });
  }

}
