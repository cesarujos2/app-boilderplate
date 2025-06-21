import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true
})
export class TitleCasePipe implements PipeTransform {
  
  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Eliminar espacios extra
    const cleanValue = value.trim();
    
    if (cleanValue.length === 0) {
      return '';
    }

    // Capitalizar la primera letra de cada palabra
    return cleanValue
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
