import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppInfoService } from '@core/services';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private API_URL = `${inject(AppInfoService).getApiUrl()}/Log`;
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
