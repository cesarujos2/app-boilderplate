import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of, switchMap, timer } from "rxjs";
import { FtaService } from "../services/fta.service";

export function projectNameAsyncValidator(ftaService: FtaService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.disabled) return of(null);

    const projectName: string = control.value;
    return timer(600).pipe(
      switchMap(() => ftaService.validateNameProject(projectName).pipe(
        map((response) => {
          return (!response.repeated ? null : { exists: true })
        }),
        catchError(() => of({ exists: true }))
      ))
    )
  };
}