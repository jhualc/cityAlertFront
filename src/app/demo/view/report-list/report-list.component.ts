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
    // Obtener el token de autorización
    const token = this.authService.getToken();
  
    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Token en formato Bearer
    });
  
    // Realizar la solicitud GET para obtener los reportes
    this.http.get<{ Success: boolean, Message: string, Data: Report[] }>(this.apiUrl, { headers })
      .subscribe(
        (response) => {
          // Verificamos si la respuesta es exitosa
          if (response.Success) {
            // Asignamos los reportes al arreglo 'reports'
            this.reports = response.Data;
          } else {
            console.error('No se pudieron obtener los reportes:', response.Message);
          }
        },
        (error) => {
          console.error('Error al obtener los reportes:', error);
        }
      );
  }
  

}
