import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of, Subject, switchMap, timer } from "rxjs";
import { FtaService } from "../services/fta.service";
import { IValidateLegalRepresentativeResponse } from "../interface/general";
import { IPerson } from "../models/fta.interface";

export const legalResult = new Subject<IValidateLegalRepresentativeResponse | null>();

export function legalAsyncValidator(ftaService: FtaService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.disabled) return of(null);
    legalResult.next(null);

    const person: IPerson = control.value;
    return timer(600).pipe(
      switchMap(() => ftaService.validateLegalRepresentative(person).pipe(
        map((response) => {
          legalResult.next(response ? response : null);
          return (response ? null : { personNotFound: true })
        }),
        catchError(() => of({ personNotFound: true }))
      ))
    )
  };
}
