import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

type RucType = 'any' | '10' | '20';

export function isRucValidator(type: RucType = 'any'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();

    if (!value) return null;

    if (!(/^(10|20)\d{9}$/.test(value))) return { invalidRuc: true };

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

