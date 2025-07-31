import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function equalToValidator(fieldToMatch: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const matchingControl = control.parent.get(fieldToMatch);
    if (!matchingControl) {
      return null;
    }

    return control.value === matchingControl.value ? null : { notEqual: true };
  };
}
