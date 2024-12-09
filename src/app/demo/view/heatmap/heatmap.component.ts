import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat'; // Importar el complemento de mapas de calor

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',

})
export class HeatmapComponent implements OnInit {
  private map!: L.Map;

  // Datos de ejemplo (latitud, longitud, intensidad)
  private heatmapData: [number, number, number][] = [
    [4.70778, -74.2328, 0.5], // San Francisco
    [4.70758, -74.2328, 0.6],
    [4.70708, -74.2328, 70.7],
    [4.70378, -74.2328, 0.8],
    [4.70478, -74.2328, 0.9],
    [4.70578, -74.2328, 80.1],  // Chicago
    [4.70678, -74.2328, 0.5],
    [4.70978, -74.2328, 0.5],
    [4.70578, -74.2428, 0.5],
    [4.70578, -74.2528, 20.5],
    [4.70578, -74.2228, 30.5],
  ];

  ngOnInit(): void {
    this.initMap();
    this.addHeatmapLayer();
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.70778, -74.2328], 15); // Centrado en San Francisco

    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private addHeatmapLayer(): void {
    const heatLayer = (L as any).heatLayer(this.heatmapData, {
      radius: 25,       // Radio del área de calor
      blur: 15,         // Nivel de desenfoque
      maxZoom: 17,      // Máximo nivel de zoom
    });
    heatLayer.addTo(this.map);
  }
}
