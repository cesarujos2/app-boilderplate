import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxSizeValidator(size: number, type: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (!file) return null;

    const maxSizeBytes = size;
    if (!(file instanceof File)) return { invalidFile: true };
    if (file.type !== type) return { invalidFile: true };
    if (file.size > maxSizeBytes) return { maxSizeExceeded: { size: Math.floor(size / (1024 * 1024)) } };

    return null;
  };
}
