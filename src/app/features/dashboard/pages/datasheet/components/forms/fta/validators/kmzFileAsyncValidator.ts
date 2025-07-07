import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { FtaService } from "../services/fta.service";
import { catchError, map, Observable, of, take } from "rxjs";

export function kmzFileAsyncValidator(ftaService: FtaService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    
    if (!control.value || control.disabled || !(control.value instanceof File)) {
      return of(null);
    }

    const file: File = control.value;
    return ftaService.validateCoordinatesFile(file).pipe(
      take(1),
      map((response) => {
        return response.errorMessages?.length == 0 ? null : { kmzInvalid: true };
      }),
      catchError(() => of({ serverError: true }))
    );
  };
}
