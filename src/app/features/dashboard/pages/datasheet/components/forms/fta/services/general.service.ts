import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { IInitialData, IUbigeo } from '../interface/general';
import { IPerson } from '../models/fta.interface';
import { environment } from '@environments/environment';

const API_USERS_URL = `${environment.API.URL}/GeneralData`;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly http = inject(HttpClient);

  initialDataSubject = new BehaviorSubject<IInitialData>({});
  validateFormSubject = new BehaviorSubject<number>(-1);
  budgetSubject = new Subject<number| undefined>();
  startDateSubject = new Subject<string| undefined>();
  lifetimeSubject = new Subject<number| undefined>();

  //With Signals
  initialData = toSignal(this.getInitialData(), { initialValue: {} as IInitialData})
  hasGoogleScript = signal(false)


  getInitialData(): Observable<IInitialData> {
    return this.http.get<IInitialData>(`${API_USERS_URL}/InitialData`).pipe(
      catchError(() => of({} as IInitialData))
    );
  }

  listProvinces(departmentId: string): Observable<IUbigeo[]> {
    return this.http.get<IUbigeo[]>(`${API_USERS_URL}/ListProvinces/${departmentId}`);
  }

  listDistricts(provinceId: string): Observable<IUbigeo[]> {
    return this.http.get<IUbigeo[]>(`${API_USERS_URL}/ListDistricts/${provinceId}`);
  }

  personInformation(documentType: string, documentNumber: string): Observable<IPerson> {
    return this.http.get<IPerson>(`${API_USERS_URL}/PersonInformation?documentType=${documentType}&documentNumber=${documentNumber}`);
  }

}
