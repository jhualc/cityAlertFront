import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { lastValueFrom } from 'rxjs';

// Fix de íconos de Leaflet


import { Icon } from 'leaflet';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

interface Coordinate {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map-route',
  templateUrl: './dijkstra.component.html',
  styleUrls: ['./dijkstra.component.scss']
})
export class MapRouteComponent implements OnInit {
  coordinates: Coordinate[] = [];
  shortestPath: Coordinate[] = [];
  map!: L.Map;
  mapReady = false;
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: L.latLng(4.60971, -74.08175)
  };

  private alertsUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCoordinateData(2);
  }

  async loadCoordinateData(tipo: number): Promise<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response: any = await lastValueFrom(
        this.http.get(this.alertsUrl, { headers })
      );

console.log("response:::", response);

      if (response?.Success) {
        const filtered = response.Data.filter((item: any) => item.AlertStatusId === tipo || item.AlertStatusId === 8);
                console.log("filtered:::", filtered)
        this.coordinates = filtered.map((report: any) => ({
          lat: report.Longitude,  
          lng: report.Latitude
        }));
        console.log("coordendas:::", this.coordinates);
        if (this.coordinates.length > 0) {
          this.options.center = L.latLng(this.coordinates[0].lat, this.coordinates[0].lng);
        }

        this.shortestPath = this.solveTSP(this.coordinates);

        if (this.mapReady) {
          this.drawMarkersAndPath();
        }
      }
    } catch (error) {
      console.error('Error al cargar coordenadas desde la API:', error);
    }
  }

  onMapReady(map: L.Map): void {
    this.map = map;
    this.mapReady = true;
    if (this.coordinates.length > 0) {
      this.drawMarkersAndPath();
    }
  }

  drawMarkersAndPath(): void {
    this.coordinates.forEach(coord => {
      L.marker([coord.lat, coord.lng]).addTo(this.map);
    });

    const latlngs = this.shortestPath.map(coord => [coord.lat, coord.lng]) as [number, number][];
    L.polyline(latlngs, { color: '#569ab8' }).addTo(this.map);
  }

  solveTSP(coords: Coordinate[]): Coordinate[] {
    const getDistance = (a: Coordinate, b: Coordinate): number => {
      const R = 6371;
      const dLat = (b.lat - a.lat) * Math.PI / 180;
      const dLng = (b.lng - a.lng) * Math.PI / 180;
      const lat1 = a.lat * Math.PI / 180;
      const lat2 = b.lat * Math.PI / 180;

      const aVal = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
      return R * c;
    };

    const permute = (arr: Coordinate[]): Coordinate[][] => {
      const result: Coordinate[][] = [];

      const generate = (n: number, heapArr: Coordinate[]) => {
        if (n === 1) {
          result.push([...heapArr]);
          return;
        }
        for (let i = 0; i < n; i++) {
          generate(n - 1, heapArr);
          const j = n % 2 === 0 ? i : 0;
          [heapArr[n - 1], heapArr[j]] = [heapArr[j], heapArr[n - 1]];
        }
      };

      generate(arr.length, [...arr]);
      return result;
    };

    let bestPath: Coordinate[] = [];
    let minDistance = Infinity;

    const start = coords[0];
    const others = coords.slice(1);
    const permutations = permute(others);

    permutations.forEach(perm => {
      const path = [start, ...perm];
      let distance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        distance += getDistance(path[i], path[i + 1]);
      }
      if (distance < minDistance) {
        minDistance = distance;
        bestPath = path;
      }
    });

    return bestPath;
  }
}