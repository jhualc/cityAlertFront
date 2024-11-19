import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Report {
  UserId: number;
  Latitude: number;
  Longitude: number;
  Address: string;
  Comments: string;
}

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  reports: Report[] = []; // Inicialmente vacío
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/geo/geomarks';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    this.http.get<{ GeoMarks: Array<{ UserId: number, Latitude: number, Longitude: number, Address: string, Comments: string }> }>(this.apiUrl).subscribe(
      (response) => {
        this.reports = response.GeoMarks; // Accedemos a la propiedad GeoMarks para obtener el arreglo
      },
      (error) => {
        console.error('Error al obtener los reportes:', error);
      }
    );
  }

}
