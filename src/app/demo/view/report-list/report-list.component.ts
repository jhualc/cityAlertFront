import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { ReportServiceService } from '../../service/report-service.service';
import { Table} from 'primeng/table';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Router } from '@angular/router';

interface Report {
  UserId: number;
  Latitude: number;
  Longitude: number;
  Address: string;
  Comments: string;
  AlertStatusId: number;
  AlertStatusDescription?: string;
  CreatedAt: Date;
  Id: number; // ID del reporte para la eliminación
}

interface Status {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  selectedRows: Report[] = [];
  status: Status[] = [];
  cols: any[] = [];
  isCurrentUserAdmin = false;
  carga: boolean = true;
  roleid: string = this.authService.getRole();

  private apiUrlAll = 'https://cityalertapi-dev.azurewebsites.net/alerts/all';
  private apiUrlUser = 'https://cityalertapi-dev.azurewebsites.net/alerts';
  private statusUrl = 'https://cityalertapi-dev.azurewebsites.net/data/alertstatuses';
  private deleteUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts'; // URL base para eliminar alertas

  constructor(private http: HttpClient, 
              private authService: AuthService, 
              private reportService: ReportServiceService, 
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getUser(); 
    this.isCurrentUserAdmin = userId === '{"id":26}';
    this.loadData();
  }

  loadData(): void {
    this.carga = true;
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Obtener el UserId del token de autenticación
    const userId = this.authService.getUser(); // Ajusta según cómo recuperes el UserId del token
    console.log("USer_id::", userId);
    const apiUrl = userId === '{"id":26}' ? this.apiUrlAll : this.apiUrlUser;

    // Ejecutar las solicitudes al endpoint correspondiente
    Promise.all([
      this.http.get<{ Success: boolean, Message: string, Data: Report[] }>(apiUrl, { headers }).toPromise(),
      this.http.get<{ Success: boolean, Message: string, Data: Status[] }>(this.statusUrl, { headers }).toPromise()
    ])
    .then(([reportsResponse, statusResponse]) => {
      if (reportsResponse?.Success && statusResponse?.Success) {
        this.reports = this.mapStatusesToAlerts(reportsResponse.Data, statusResponse.Data);
      } else {
        console.error('Error al obtener datos:', reportsResponse?.Message, statusResponse?.Message);
      }
      this.carga = false;
    })
    .catch((error) => {
      console.error('Error al cargar datos:', error);
    });
  }

  // Función para mapear AlertStatusId a su descripción
  private mapStatusesToAlerts(reports: Report[], statuses: Status[]): Report[] {
    return reports.map((report) => {
      const status = statuses.find((s) => s.Id === report.AlertStatusId);
      return {
        ...report,
        AlertStatusDescription: status ? status.Name : 'Desconocido'
      };
    });
  }

  // Método para eliminar un reporte
  deleteReport(reportId: number): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`${this.deleteUrl}/${reportId}`, {
      headers,
      body: { reason: 'Eliminación solicitada' } // Reemplaza con los datos que el API espera
    }).subscribe({
      next: () => {
        this.reports = this.reports.filter(report => report.Id !== reportId);
        alert('Reporte eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar el reporte:', err);
        alert(`No se pudo eliminar el reporte: ${err.error.Message || 'Error desconocido'}`);
      }
    });
  }

  deleteData(reporte: Report) {
    //this.deleteDataDialog = true;
    //this.equipo = { ...equipo };
  }

  editData(reporte: Report) {
    //this.equipo = { ...equipo };
    //this.dataDialog = true;
  }

  redirect(reporte: Report) {
    this.router.navigate(['/pages/timeline/' + reporte.Id]); // Redirige al login después de cerrar sesión
    //this.equipo = { ...equipo };
    //this.dataDialog = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

}
