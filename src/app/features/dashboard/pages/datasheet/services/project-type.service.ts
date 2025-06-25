import { inject, Injectable, signal } from "@angular/core";
import { ApiResponse } from "@core/models/api/apiResponse";
import { catchError, Observable, of, switchMap } from "rxjs";
import { ProjectType } from "../models/project-type.interface";
import { HttpClient } from "@angular/common/http";
import { AppInfoService } from "@core/services";

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {
  private baseUrl = `${inject(AppInfoService).getApiUrl()}/Datasheet`;
  private http = inject(HttpClient);
  projectTypes = signal<ProjectType[]>([]);

  getProjectTypes(): Observable<ProjectType[]> {
    return this.http.get<ApiResponse<ProjectType[]>>(`${this.baseUrl}/project-type`).pipe(
      switchMap(response => {
        if (response.success) {
          this.projectTypes.set(response.data);
          return of(response.data);
        }
        return of([]);
      }),
      catchError(() => {
        console.error('Error fetching project types');
        return of([]);
      })
    );
  }
}