import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private baseUrl = environment.URL_BACKEND + '/alerts';

  constructor(private http: HttpClient) {}

  deleteReport(reportId: number): Observable<void> {
    const url = `${this.baseUrl}/${reportId}`;
    return this.http.delete<void>(url);
  }
}