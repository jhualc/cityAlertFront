import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../breadcrumb.service';
import {PrimeIcons} from 'primeng/api';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './app.timelinedemo.component.html',
    styles: [`
        .custom-marker {
            display: flex;
            width: 2rem;
            height: 2rem;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            border-radius: 50%;
            z-index: 1;
        }
        
        ::ng-deep {
            .p-timeline-event-content,
            .p-timeline-event-opposite {
                line-height: 1;
            }
        }
        
        @media screen and (max-width: 960px) {
            :host ::ng-deep {
                .customized-timeline {
                    .p-timeline-event:nth-child(even) {
                        flex-direction: row !important;
        
                        .p-timeline-event-content {
                            text-align: left !important;
                        }
                    }
        
                    .p-timeline-event-opposite {
                        flex: 0;
                    }
        
                    .p-card {
                        margin-top: 1rem;
                    }
                }
            }
        }
    `]
})
export class AppTimelineDemoComponent implements OnInit {

    customEvents: any[] = [];
    alertStatuses: any[] = [];

    horizontalEvents: any[];

    constructor(private breadcrumbService: BreadcrumbService, private http: HttpClient, private route: ActivatedRoute ) {
        this.breadcrumbService.setItems([
            {label: 'Pages'},
            {label: 'Timeline', routerLink: ['/pages/timeline']}
        ]);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const alertId = +params['id']; // Convertir a número
            if (alertId) {
              this.fetchTimelineData(alertId);
            }
          });
      }
    
      fetchTimelineData(alertId: number) {
        const alertsEndpoint = `https://cityalertapi-dev.azurewebsites.net/alerts/${alertId}`;
        const statusesEndpoint = 'https://cityalertapi-dev.azurewebsites.net/data/alertstatuses';
      
        console.log("Calling endpoint:", alertsEndpoint);
      
        // Obtener los estados de alerta
        this.http.get<any>(statusesEndpoint).subscribe(statusesResponse => {
          if (statusesResponse.Success && statusesResponse.Data.length > 0) {
            this.alertStatuses = statusesResponse.Data;
      
            // Obtener los datos de la alerta
            this.http.get<any>(alertsEndpoint).subscribe(alertsResponse => {
              console.log("alertsResponse::", alertsResponse);
      
              if (alertsResponse.Success && alertsResponse.Data) {
                const trackingData = alertsResponse.Data.Tracking; // Acceder al array de Tracking
      
                // Mapear los datos de Tracking para customEvents
                this.customEvents = trackingData.map((tracking: any) => {
                  const statusName = this.getAlertStatusName(tracking.AlertStatusId); // Obtener el nombre del estado
                  return {
                    status: `${tracking.Tracker} (${statusName})`, // Mostrar Tracker y Estado
                    date: new Date(tracking.RegistrationDate).toLocaleString(), // Formato de fecha
                    icon: this.getIcon(statusName), // Icono predeterminado
                    color: '#9C27B0', // Color predeterminado
                    comments: tracking.Comments // Comentarios
                  };
                });
      
                console.log("customEvents:", this.customEvents); // Imprime los eventos procesados
              }
            }, error => {
              console.error("Error fetching alert details:", error);
            });
          }
        }, error => {
          console.error("Error fetching alert statuses:", error);
        });
      }
      
      getIcon(alertstatusType: string){

        let icon: any ;
        if (alertstatusType === 'Registrado'){
            icon = PrimeIcons.CLOCK;
        }

        return icon;
      }
    
      // Método auxiliar para obtener el nombre del estado según el AlertStatusId
      getAlertStatusName(alertStatusId: number): string {
        const status = this.alertStatuses.find(s => s.Id === alertStatusId);
        return status ? status.Name : 'Estado desconocido'; // Devuelve el nombre o un valor predeterminado
      }
}
