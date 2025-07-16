import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../breadcrumb.service';
import {PrimeIcons} from 'primeng/api';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    `],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppTimelineDemoComponent implements OnInit {

    customEvents: any[] = [];
    alertStatuses: any[] = [];

    horizontalEvents: any[];

    StatusMapColor: { [key: string]: string } = {
      'Registrado': '#14A2B8',
      'En revisión': '#ffe082',
      'Finalizado': '#9fdaa8',
      'Rechazado': '#f19ea6',
      'Observación': '#ffaa4a'
    };

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
        const alertsEndpoint =  environment.URL_BACKEND + `/alerts/${alertId}`;
        const statusesEndpoint = environment.URL_BACKEND + '/data/alertstatuses';
    
        console.log("Calling endpoint:", alertsEndpoint);
    
        // Obtener los estados de alerta
        this.http.get<any>(statusesEndpoint).subscribe(statusesResponse => {
            if (statusesResponse.Success && statusesResponse.Data.length > 0) {
                this.alertStatuses = statusesResponse.Data;
    
                // Obtener los datos de la alerta
                this.http.get<any>(alertsEndpoint).subscribe(alertsResponse => {
                    console.log("alertsResponse::", alertsResponse);
    
                    if (alertsResponse.Success && alertsResponse.Data) {
                        const alertData = alertsResponse.Data;
                        let trackingData = alertData.Tracking || [];
    
                        this.customEvents = [];
    
                        // ✅ Si hay tracking data, tomamos el primer registro directamente desde Tracking[]
                        if (trackingData.length > 0) {
                            this.customEvents = trackingData.map((tracking, index) => {
                                const statusName = this.getAlertStatusName(tracking.AlertStatusId);
                                const color = this.getIconColor(statusName);
    
                                // ✅ Si es el primer valor y el estado es = 1, tomar el comentario desde el objeto raíz
                                const comments = (index === 0 && tracking.AlertStatusId === 1) 
                                    ? alertData.Comments 
                                    : tracking.Comments || '';
    
                                return {
                                    status: `${tracking.Tracker}`,
                                    statusonly: `${statusName}`,
                                    date: new Date(tracking.RegistrationDate).toLocaleString(),
                                    icon: this.getIcon(statusName),
                                    color: color,
                                    comments: comments
                                };
                            });
                        }
    
                        console.log("✅ customEvents:", this.customEvents); // Verifica los eventos procesados
                    }
                }, error => {
                    console.error("❌ Error fetching alert details:", error);
                });
            }
        }, error => {
            console.error("❌ Error fetching alert statuses:", error);
        });
    }
    
    
    
      
      getIcon(alertstatusType: string): string {
        const iconMap: { [key: string]: string } = {
          'Registrado': PrimeIcons.CLOCK,
          'En revisión': PrimeIcons.SEARCH,
          'Finalizado': PrimeIcons.CHECK,
          'Rechazado': PrimeIcons.TIMES_CIRCLE,
          'Observación': PrimeIcons.INFO
        };
      
        return iconMap[alertstatusType] || PrimeIcons.QUESTION; // Devuelve un icono predeterminado si no se encuentra
      }

      obtenerColor(estado: string): string {
        return this.StatusMapColor[estado] || 'white'; // Color por defecto si no se encuentra
      }

      getIconColor(alertstatusType: string): string {
        const iconMapColor: { [key: string]: string } = {
          'Registrado': '#14A2B8',
          'En revisión': '#ffe082',
          'Finalizado': '#9fdaa8',
          'Rechazado': '#f19ea6',
          'Observación': '#ffaa4a'
        };


        
        console.log (iconMapColor[alertstatusType] );
      
        return iconMapColor[alertstatusType] || '#ff0000'; // Devuelve un icono predeterminado si no se encuentra
      }
      
    
      // Método auxiliar para obtener el nombre del estado según el AlertStatusId
      getAlertStatusName(alertStatusId: number): string {
        const status = this.alertStatuses.find(s => s.Id === alertStatusId);
        return status ? status.Name : 'Estado desconocido'; // Devuelve el nombre o un valor predeterminado
      }
}
