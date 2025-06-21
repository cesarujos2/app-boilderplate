import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase',
  standalone: true
})
export class SentenceCasePipe implements PipeTransform {
  
  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Eliminar espacios extra y convertir a minúsculas
    const cleanValue = value.trim().toLowerCase();
    
    if (cleanValue.length === 0) {
      return '';
    }

    // Capitalizar la primera letra y mantener el resto en minúsculas
    return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
  }
}
