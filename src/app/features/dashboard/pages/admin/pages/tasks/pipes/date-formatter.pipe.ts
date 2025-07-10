import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true
})
export class DateFormatterPipe implements PipeTransform {
  private locale = inject(MAT_DATE_LOCALE);

  transform(value: string | Date, format: string): string {
    return `${new DatePipe(String(this.locale)).transform(value, format)}`;
  }

}
