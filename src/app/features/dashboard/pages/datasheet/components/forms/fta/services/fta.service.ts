import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, firstValueFrom, map, Observable, of } from 'rxjs';
import { serialize } from 'object-to-formdata';
import { IFTA, IPerson } from '../models/fta.interface';
import { IInfraestructureRules, IMaster, IValidateLegalRepresentativeResponse } from '../interface/general';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FtaService {
    private API_URL = `${environment.API.URL}/Fitac`;
    private http = inject(HttpClient)
    constructor() { }

    validateConsultant() {
        return this.http.get<{ found: boolean }>(`${this.API_URL}/GetConsultantData`).pipe(
            map((response) => {
                return response.found;
            }),
            catchError((error) => {
                return EMPTY
            })
        );
    }

    validateLegalRepresentative(request: IPerson): Observable<IValidateLegalRepresentativeResponse> {
        return this.http.post<IValidateLegalRepresentativeResponse>(`${this.API_URL}/ValidateLegalRepresentative`, request)
    }

    validateNameProject(name: string) {
        name = encodeURIComponent(name);
        return this.http.get<{ repeated: boolean }>(`${this.API_URL}/ValidateNameProject?ProjectName=${name}`);
    }

    validateCoordinatesFile(file: File): Observable<{ errorMessages: string[] }> {
        let form: FormData = new FormData();
        form.append('file', file);
        return this.http.post<{ errorMessages: string[] }>(`${this.API_URL}/ValidateCoordinatesFile`, form);
    }

    getPointsAndPolylineFromFile(file: File): Observable<IFeaturesFromFiles> {
        let form: FormData = new FormData();
        form.append('file', file);
        return this.http.post<IFeaturesFromFiles>(`${this.API_URL}/LoadKmzFile`, form);
    }

    validateCoordinates(coordinateType: string, coordinates: string) {
        return this.http.post<{ validationResult: string[], pointsInPeru: google.maps.LatLngLiteral[] }>(`${this.API_URL}/ValidateCoordinates`, { coordinateType: coordinateType, coordinateList: coordinates });
    }

    getInfraestructureRules(zoningCode: string, infraestructureType: string) {
        return this.http.get<IInfraestructureRules>(`${this.API_URL}/GetInfraestructureRules?zoningCode=${zoningCode}&infraestructureType=${infraestructureType}`);
    }

    //Deuda técnica - método debe ir en Master
    getContingencyMeasures(infraestructureType: string) {
        return this.http.get<{ contingencyMeasures: IMaster[] }>(`${this.API_URL}/GetContingencyMeasures?TypeInfraestructure=${infraestructureType}`);
    }

    registerFta(data: IFTA) {
        const formData = serialize(data, {
            indices: true,
            dotsForObjectNotation: true
        });
        return this.http.post<{ id: string }>(`${this.API_URL}/RegisterFta`, formData)
    }

    getFtaData(id: string) {
        return this.http.get<IFTA>(`${this.API_URL}/GetFtaData?Id=${id}`);
    }

    async previewPdf(data: IFTA): Promise<string> {
        const formData = serialize(data, {
            indices: true,
            dotsForObjectNotation: true
        });

        const pdfBlob = await firstValueFrom(
            this.http.post(`${this.API_URL}/ShowPdfPreview`, formData, { responseType: 'blob' })
        );

        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        return window.URL.createObjectURL(blob);
    }


}

export interface IFeaturesFromFiles {
    maxPoint?: google.maps.LatLngLiteral,
    minPoint?: google.maps.LatLngLiteral,
    points: google.maps.LatLngLiteral[],
    polylines: {
        path: google.maps.LatLngLiteral[],
    }[]
}