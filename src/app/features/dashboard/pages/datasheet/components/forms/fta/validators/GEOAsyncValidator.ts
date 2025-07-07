import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of, Subject, switchMap, timer } from "rxjs";
import { FtaService } from "../services/fta.service";
import { ICoordinatesGeo } from "../models/fta.interface";

export const geoCoordResult = new Subject<{ validationResult: string[], pointsInPeru: google.maps.LatLngLiteral[] } | null>();

export function GEOAsyncValidator(ftaService: FtaService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value || control.disabled) return of(null);

        const value: ICoordinatesGeo[] = control.value;
        const coord: string = value.map(x => `${x.lat},${x.lng}`).join('\n')
        return timer(800).pipe(
            switchMap(() => ftaService.validateCoordinates('GEO', coord).pipe(
                map((response) => {
                    geoCoordResult.next(response)
                    return (response.validationResult.length == 0 ? null : { invalidUGEO: true })
                }),
                catchError(() => of({ invalidUGEO: true }))
            ))
        )
    };
}