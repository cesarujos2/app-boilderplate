import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../datasheet/components/forms/fta/adapters/dateAdapter';
import { LogService } from './services/log.service';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  templateUrl: './log.page.html',
  styleUrl: './log.page.scss',
  encapsulation: ViewEncapsulation.None
})
export default class LogComponent {
  private readonly logService = inject(LogService);

  selectedDate = signal<Date>(this.getCurrentDate());
  rowLog = signal<string>('No logs available for today');

  constructor(){
    this.logService.getLogs(this.selectedDate()).subscribe(x => this.rowLog.set(this.highlightLog(x)));
  }


  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      this.selectedDate.set(date);
      this.logService.getLogs(date).subscribe( x => this.rowLog.set(this.highlightLog(x)));
    }
  }

  private getCurrentDate(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  private highlightLog(log: string): string {
    if (!log) return '';
    log = log.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return log
      .replace(/\[(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})]/g,
               `<span class="log-page_timestamp">[$1]</span>`)
      .replace(/\[(?<level>INF|WRN|ERR|DBG|FTL)]/g,
               (match, level) => `<span class="log-page_level ${level.toLowerCase()}">[${level}]</span>`)
      .replace(/(----- ERROR LOG START -----)/g,
               `<span class="log-page_header">$1</span>`)
      .replace(/(----- ERROR LOG END -----)/g,
               `<span class="log-page_footer">$1</span>`)
      .replace(/\n/g, '<br>');
  }
}
