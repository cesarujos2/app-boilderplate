import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private API_URL = `${environment.apiUrl}/Log`;
  private http = inject(HttpClient);

  getLogs(date: Date): Observable<string> {

    return this.http.get<{ content: string }>(`${this.API_URL}`, {
      params: {
        from: date.toISOString()
      }
    })
      .pipe(
        map((response: { content: string }) => {
          if (response && response.content && response.content.length > 0) {
            return response.content;
          } else {
            return 'No logs found for the specified date.';
          }
        }),
        catchError((error) => {
          console.error('Error fetching logs:', error);
          return of('');
        })
      );
  }


  constructor() { }
}
