import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function rucValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const validRuc = /^\d{11}$/.test(value);
      return validRuc ? null : { invalidRuc: true };
    };
  }