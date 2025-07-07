import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMaster } from '../interface/general';
import { environment } from '@environments/environment';
const API_USERS_URL = `${environment.API.URL}/Master`;

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  listMimicryTypes(infraestructureType: string): Observable<IMaster[]> {
    return this.http.get<IMaster[]>(`${API_USERS_URL}/ListMimicryTypes?infraestructureType=${infraestructureType}`);
  }

  listComponents(environment: string): Observable<IMaster[]> {
    return this.http.get<IMaster[]>(`${API_USERS_URL}/ListComponents?environment=${environment}`);
  }

  listEnviromentalMeasures(stage: string ,infraestructureType: string): Observable<{enviromentalMeasures: IMaster[]}> {
    return this.http.get<{enviromentalMeasures: IMaster[]}>(`${API_USERS_URL}/GetEnviromentalMeasuresQuery?TypeInfraestructure=${infraestructureType}&StageCode=${stage}`);
  }
}
