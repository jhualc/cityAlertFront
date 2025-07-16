import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { ReportServiceService } from '../../service/report-service.service';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs'; // Para convertir Observable en Promesa
import { Location } from '@angular/common';
import swal from 'sweetalert2'
import { environment } from 'src/environments/environment';

interface Report {
  UserId: number;
  Latitude: number;
  Longitude: number;
  Address: string;
  Comments: string;
  AlertStatusId: number;
  AlertStatusDescription?: string;
  AlertTypeId: string;
  CreatedAt: Date;
  Id: number; // ID del reporte
  CanBeDeleted: boolean;
}

interface Status {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss','../../../../assets/demo/badges.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  editDialog: boolean = false; // Controla el modal de edición
  selectedReportId: number | null = null; // Reporte seleccionado para edición
  editComments: string = ''; // Comentario del usuario
  selectedRows: Report[] = [];
  status: Status[] = [];
  cols: any[] = [];
  isCurrentUserAdmin = false;
  roleid: string = this.authService.getRole();
  isSaving: boolean = false;
  isRegistrado: boolean = false;
  isAsignado: boolean = true;
  isFinalizado: boolean = true;
  tipo: number;
  loading: boolean = false;

  StatusMapColor: { [key: string]: string } = {
    'Registrado': '#14A2B8',
    'En revisión': '#ffe082',
    'Finalizado': '#9fdaa8',
    'Rechazado': '#f19ea6',
    'Observación': '#ffaa4a'
  };

  private apiUrlAll = environment.URL_BACKEND + '/alerts/all';
  private apiUrlUser = environment.URL_BACKEND + '/alerts';
  private statusUrl = environment.URL_BACKEND + '/data/alertstatuses';
  private deleteUrl = environment.URL_BACKEND + '/alerts';
  private updateUrl = environment.URL_BACKEND + '/alerts/tracking';

  // 📌 Definir las opciones del select en el componente TypeScript
  statusOptions = [

    { label: 'En revisión', value: 2 },
    { label: 'Finalizado', value: 3 },
    { label: 'Rechazado', value: 5 },
  ];
  
  filteredStatusOptions: any[] = [];
  selectedStatus: number = 0; // Estado seleccionado en el modal

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private reportService: ReportServiceService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadData(1); //Registrados
  }



  loadData(tipo: number): void {
    this.tipo = tipo;
    this.loading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const apiUrl = this.roleid === '2' && (tipo === 1) ? this.apiUrlAll : this.apiUrlUser;

    Promise.all([
      this.http.get<{ Success: boolean, Message: string, Data: Report[] }>(apiUrl, { headers }).toPromise(),
      this.http.get<{ Success: boolean, Message: string, Data: Status[] }>(this.statusUrl, { headers }).toPromise()
    ])
    .then(([reportsResponse, statusResponse]) => {
      if (reportsResponse?.Success && statusResponse?.Success) {
        this.reports = this.mapStatusesToAlerts(reportsResponse.Data, statusResponse.Data);
        if (/*this.roleid == '2' &&*/ tipo == 1)
        {
          this.reports = this.reports.filter(x => x.AlertStatusId == tipo || x.AlertStatusId == 8);
          this.isRegistrado=false;
          this.isAsignado=true;
          this.isFinalizado=true;
        }
        else if (/*this.roleid == '2' &&*/ tipo == 2)
        {
          if (this.roleid == '2' )
          {
            this.reports = this.reports.filter(x => x.AlertStatusId != 3); //3 Finalizado
          }
          else
          {
            this.reports = this.reports.filter(x => x.AlertStatusId != 3 && x.AlertStatusId != 1 && x.AlertStatusId != 8); //3 Finalizado //1 Registrado //8 Observación
          }
          this.isRegistrado=true;
          this.isAsignado=false;
          this.isFinalizado=true;
        }
        else if (/*this.roleid == '2' &&*/ tipo == 3)
          {
            this.reports = this.reports.filter(x => x.AlertStatusId == tipo);
            this.isRegistrado=true;
            this.isAsignado=true;
            this.isFinalizado=false;
          }
      } else {
        console.error('Error al obtener datos:', reportsResponse?.Message, statusResponse?.Message);
      }
      this.loading = false;
    })
    .catch((error) => {
      console.error('Error al cargar datos:', error);
    });
  }

  private mapStatusesToAlerts(reports: Report[], statuses: Status[]): Report[] {
    return reports.map((report) => {
      const status = statuses.find((s) => s.Id === report.AlertStatusId);
      return {
        ...report,
        AlertStatusDescription: status ? status.Name : 'Desconocido'
      };
    });
  }

  deleteReport(reportId: number): void {
    this.loading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`${this.deleteUrl}/${reportId}`, {
      headers,
      body: { reason: 'Eliminación solicitada' }
    }).subscribe({
      next: () => {
        this.reports = this.reports.filter(report => report.Id !== reportId);
        //alert('Reporte eliminado correctamente');
        swal.fire({
          title: 'Seguimiento Alerta!', 
          text: 'Alerta eliminada correctamente!', 
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#5E81AC'
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al eliminar el reporte:', err);
        //alert(`No se pudo eliminar el reporte: ${err.error.Message || 'Error desconocido'}`);
        swal.fire({
          title: 'Registrar Alerta!', 
          text: "'No se pudo eliminar la alerta: ${err.error?.Message || 'Error desconocido'}", 
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#5E81AC'
        });
        this.loading = false;
      }
    });
    
  }

  // 📌 Método para abrir el modal con el reporte seleccionado
  openEditDialog(report: Report): void {
    this.selectedReportId = report.Id;
    this.editComments = ''; // Precargar comentario existente si hay
    this.selectedStatus = report.AlertStatusId; // Resetear el estado al abrir el modal
    this.filteredStatusOptions = this.statusOptions.filter(option => option.value >= report.AlertStatusId);
    this.editDialog = true; // Mostrar el modal
  }

  // 📌 Método para actualizar un reporte
  async editReport(): Promise<void> {
    this.loading = true;
    if (!this.selectedReportId) {
      alert("No se ha seleccionado un reporte válido.");
      return;
    }

    this.isSaving = true; // 🔴 Deshabilitar botón mientras se ejecuta la actualización

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Obtener el estado actual del reporte
    const alertStatusId = await this.getStatus(this.selectedReportId);

    if(this.roleid == '3'){
      this.selectedStatus = 8
    }

    const body = {
      "TrakerId": 31,
      "AlertId": this.selectedReportId,
      "AlertStatusId": this.selectedStatus ? this.selectedStatus : '8',
      "Comments": this.editComments,
      "Status": this.selectedStatus // Incluir el estado seleccionado en la petición
    };

    try {
      await lastValueFrom(this.http.post(`${this.updateUrl}`, body, { headers }));
              swal.fire({
                title: 'Seguimiento Alerta!', 
                text: 'Alerta actualizada correctamente!', 
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#5E81AC'
              });
      //alert('Reporte actualizado correctamente');
      this.editDialog = false; // Cerrar modal después de actualizar
      this.loading = false;
    } catch (err: any) {
      console.error('Error al actualizar el reporte:', err);
              swal.fire({
                title: 'Registrar Alerta!', 
                text: "'No se pudo actualizar la alerta: ${err.error?.Message || 'Error desconocido'}", 
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#5E81AC'
              });
      //alert(`No se pudo actualizar el reporte: ${err.error?.Message || 'Error desconocido'}`);
    }finally {
      this.isSaving = false; // 🔵 Rehabilitar el botón después de la respuesta
      this.loading = false;
      this.loadData(this.tipo); 
  }
  }

  async getStatus(reportId: number): Promise<number | null> {
    console.log("Ingresando al getStatus::", reportId);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response: any = await lastValueFrom(
        this.http.get(`${this.apiUrlUser}/${reportId}`, { headers })
      );

      console.log("Respuesta del servidor:", response);
      return response?.Data?.AlertStatusId ?? null;
    } catch (err: any) {
      console.error('Error al obtener el estado del reporte:', err);
      return null;
    }
  }

  redirect(reporte: Report) {
    this.router.navigate(['/pages/timeline/' + reporte.Id]);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  GoBack()
  {
    this.location.back(); 
  }

  LoadReport(tipo: number)
  {
    this.loadData(tipo);
  }

  obtenerColor(estado: string): string {
    return this.StatusMapColor[estado] || 'white'; // Color por defecto si no se encuentra
  }

}
