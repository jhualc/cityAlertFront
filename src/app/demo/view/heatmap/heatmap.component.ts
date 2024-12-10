import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat'; // Importar el complemento de mapas de calor
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
})
export class HeatmapComponent implements OnInit {
  private map!: L.Map;
  private heatmapData: [number, number, number][] = []; // Array vacío que se llenará con los datos de la API
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts/all'; // URL del endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.initMap();
    this.getHeatmapData(); 
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.70778, -74.2328], 15); 

    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private getHeatmapData(): void {
    // Obtener el token de autorización
    const token = this.authService.getToken();

    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Token en formato Bearer
    });

    // Realizar la solicitud GET
    this.http.get<{ Data: any[] }>(this.apiUrl, { headers })
      .subscribe(
        (response) => {
          console.log("Datos obtenidos para el mapa de calor:", response.Data);

          // Iterar sobre los datos y poblar el array heatmapData
          this.heatmapData = response.Data.map(item => {
            const latitude = item.Latitude;
            const longitude = item.Longitude;
            const intensity = item.AlertStatusId === 1 ? 0.5 : 0.8; // Ajustar según tu lógica
            return [latitude, longitude, intensity];
          });

          this.addHeatmapLayer(); // Agregar la capa de mapa de calor después de cargar los datos
        },
        (error) => {
          console.error('Error al obtener los datos para el mapa de calor:', error);
        }
      );
  }

  private addHeatmapLayer(): void {
    if (this.heatmapData.length > 0) {
      const heatLayer = (L as any).heatLayer(this.heatmapData, {
        radius: 25,       // Radio del área de calor
        blur: 15,         // Nivel de desenfoque
        maxZoom: 17,      // Máximo nivel de zoom
      });
      heatLayer.addTo(this.map);
    } else {
      console.error('No hay datos para el mapa de calor');
    }
  }
}
