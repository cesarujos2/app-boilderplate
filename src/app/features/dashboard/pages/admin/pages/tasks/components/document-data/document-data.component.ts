import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TasksService } from '../../service/tasks.service';
import { DateFormatterPipe } from '../../pipes/date-formatter.pipe';

@Component({
  selector: 'app-document-data',
  standalone: true,
  imports: [
    MatIconButton, MatIcon,
    DateFormatterPipe,
    MatDialogContent
],
  templateUrl: './document-data.component.html',
  styleUrl: './document-data.component.scss'
})
export class DocumentDataComponent {
  private readonly tasksService = inject(TasksService);
  private readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<{ executionNumberId: number }>(MAT_DIALOG_DATA);

  documents = toSignal(this.tasksService.getDocumentsForExecution(this.data.executionNumberId), { initialValue: [] });

  closeDialog() {
    this.dialogRef.close();
  }
}
