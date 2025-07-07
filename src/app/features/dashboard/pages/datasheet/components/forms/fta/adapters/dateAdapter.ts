import { NativeDateAdapter, MatDateFormats } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.split('/').length === 3) {
      const dateParts = value.split('/');
      const day = +dateParts[0];
      const month = +dateParts[1] - 1;
      const year = +dateParts[2];
      return new Date(year, month, day);
    }
    return super.parse(value);
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'dd/MM',
  }
};
