import { AbstractControl, ValidationErrors, ValidatorFn, FormArray, FormGroup } from "@angular/forms";

export function selectedAtLeastOneValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const formArray = control as FormArray;

    const isValid = formArray.controls.some(
      (group) => group instanceof FormGroup && group.get(controlName)?.value === true
    );

    return isValid ? null : { atLeastOneRequired: true };
  };
}
