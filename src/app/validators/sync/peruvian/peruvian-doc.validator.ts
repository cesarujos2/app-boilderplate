import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function peruvianDocumentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const trimmed = value.trim().toUpperCase();

    const isDNI = /^[0-9]{8}$/.test(trimmed);
    const isCarnetExtranjeria = /^[A-Z0-9]{9}$/.test(trimmed);
    const isPasaporte = /^[A-Z0-9]{8,12}$/.test(trimmed);

    if (isDNI || isCarnetExtranjeria || isPasaporte) {
      return null;
    }

    return { invalidPeruvianDocument: true };
  };
}
