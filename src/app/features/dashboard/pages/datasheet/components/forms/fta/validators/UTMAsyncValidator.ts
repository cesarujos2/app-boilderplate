import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of, Subject, switchMap, timer } from "rxjs";
import { FtaService } from "../services/fta.service";
import { ICoordinatesUTM } from "../models/fta.interface";

export const utmCoordResult = new Subject<{ validationResult: string[], pointsInPeru: google.maps.LatLngLiteral[] } | null>();

export function UTMAsyncValidator(ftaService: FtaService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value || control.disabled) return of(null);

        const value: ICoordinatesUTM[] = control.value;
        const coord: string = value.map(x => `${x.zone}:${x.easting}:${x.northing}`).join('\n')
        return timer(800).pipe(
            switchMap(() => ftaService.validateCoordinates('UTM', coord).pipe(
                map((response) => {
                    utmCoordResult.next(response)
                    return (response.validationResult.length == 0 ? null : { invalidUTM: true })
                }),
                catchError(() => of({ invalidUTM: true }))
            ))
        )
    };
}