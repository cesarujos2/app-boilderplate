import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para fechas fuera de un rango específico.
 * Permite especificar un rango de fechas desde `fromDate` hasta `toDate`.
 * También permite sumar días a la fecha de inicio (`fromDate`).
 * 
 * @param fromDate Fecha de inicio (puede ser `null` o no proporcionada para usar la fecha actual).
 * @param toDate Fecha de fin (puede ser `null` o no proporcionada para no aplicar límite superior).
 * @returns Validador que verifica si la fecha está dentro del rango.
 */
export function dateOutOfRangeValidator(
  fromDate?: Date | null,
  toDate?: Date
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let inputDate = control.value;
    if (!fromDate) fromDate = new Date()
    fromDate.setHours(0, 0, 0, 0);
    if (toDate) {
      toDate.setHours(0, 0, 0, 0);
    }

    if (inputDate) {
      inputDate = new Date(inputDate);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate < fromDate) {
        return { 'dateBeforeRange': true };
      }

      if (toDate && inputDate > toDate) {
        return { 'dateAfterRange': true };
      }
    }

    return null;
  };
}
