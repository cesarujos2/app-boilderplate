import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from 'app/core/models/api/apiResponse';
import { catchError, map, Observable, of } from 'rxjs';
import { DocumentType } from '@shared/models/lookups/document-type.interface';

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    private API_URL = `https://localhost:7083/api/Lookups`;
    private readonly http = inject(HttpClient);

    // Inicializar datos del servicio
    documentTypes = toSignal(this.getDocumentTypes(), { initialValue: [] });


    
    /**
     * Obtiene los tipos de documento
     */
    getDocumentTypes(): Observable<DocumentType[]> {
        return this.http.get<ApiResponse<DocumentType[]>>(`${this.API_URL}/documentTypes`).pipe(
            map(response => response.data),
            catchError(() => of([]))
        );
    }
}
