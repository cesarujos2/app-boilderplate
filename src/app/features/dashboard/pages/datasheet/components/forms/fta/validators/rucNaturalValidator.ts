import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function rucNaturalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if(value && value.length <= 0) return null;
      if (!value || value.length !== 11) {
        return { rucNaturalInvalid: true };
      }
  
      if (value.substr(0, 2) !== '10') {
        return { rucNaturalInvalid: true };
      }

      return null; 
    };
  }