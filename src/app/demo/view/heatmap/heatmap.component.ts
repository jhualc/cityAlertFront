import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat'; // Importar el complemento de mapas de calor
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
})
export class HeatmapComponent implements OnInit {
  private map!: L.Map;
  private heatmapData: [number, number, number][] = [];
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts/all';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFuYWxpc3RhQGNvbSIsIm5hbWVpZCI6IjI2Iiwicm9sZSI6IkFuYWxpc3RhIiwibmJmIjoxNzM0NjM2NjYxLCJleHAiOjE3MzQ2NDAyNjEsImlhdCI6MTczNDYzNjY2MSwiaXNzIjoiU3VwZXJhQ2l0eUFsZXJ0IiwiYXVkIjoiU3VwZXJhQ2l0eUFsZXJ0In0.WBp4KX1fCS_hY64GU05mdf9V02lxtFmnGKb8Q4_4gNI'; // Sustituye esto con tu token real

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.loadHeatmapData();
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.70778, -74.2328], 15); // Centrado en una ubicación inicial

    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private loadHeatmapData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  
    this.http.get<any>(this.apiUrl, { headers }).subscribe(
      (response) => {
        console.log('Respuesta completa de la API:', response);
  
        if (response.Success && response.Data) {
          this.heatmapData = response.Data.map((alert: any) => {
            if (alert.Latitude && alert.Longitude) {
              console.log('Alerta válida para el mapa de calor:', alert);
              return [alert.Longitude, alert.Latitude, 40]; // Cambiar el orden
            } else {
              console.warn('Alerta omitida por falta de coordenadas:', alert);
              return null;
            }
          }).filter((item) => item !== null);
  
          console.log('Datos procesados para el mapa de calor:', this.heatmapData);
          this.addHeatmapLayer();
        } else {
          console.error('No se pudo cargar la información del mapa de calor:', response.Message);
        }
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }
  
  private addHeatmapLayer(): void {
    const heatLayer = (L as any).heatLayer(this.heatmapData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.5,
    });
  
    heatLayer.addTo(this.map);
    console.log('Capa de calor añadida al mapa:', heatLayer);
  }
  
}
