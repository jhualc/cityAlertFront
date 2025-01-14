import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private baseUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts';

  constructor(private http: HttpClient) {}

  deleteReport(reportId: number): Observable<void> {
    const url = `${this.baseUrl}/${reportId}`;
    return this.http.delete<void>(url);
  }
}