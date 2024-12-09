import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';

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
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts/all';

 

  constructor(private http: HttpClient, private authService: AuthService) {}



  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {

       // Tu token (deberías obtenerlo de una fuente segura)
   const token = this.authService.getToken();
    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Token en formato Bearer
    });

    this.http.get<{ GeoMarks: Array<{ UserId: number, Latitude: number, Longitude: number, Address: string, Comments: string }> }>(this.apiUrl, { headers })
      .subscribe(
        (response) => {
          this.reports = response.GeoMarks; // Accedemos a la propiedad GeoMarks para obtener el arreglo
        },
        (error) => {
          console.error('Error al obtener los reportes:', error);
        }
      );
  }

}
