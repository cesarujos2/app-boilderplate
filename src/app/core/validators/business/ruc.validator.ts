import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION_PATTERNS } from '@core';

type RucType = 'any' | '10' | '20';

export function rucValidator(type: RucType = 'any'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();

    if (!value) return null;

    if (!(VALIDATION_PATTERNS.RUC.test(value))) return { invalidRuc: true };

    switch (type) {
      case '10':
        return value.startsWith('10') ? null : { invalidRuc10: true };
      case '20':
        return value.startsWith('20') ? null : { invalidRuc20: true };
      default:
        return null;
    }
  };
}

