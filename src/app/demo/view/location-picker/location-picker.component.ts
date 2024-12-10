import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as L from 'leaflet';
import { SaveAddresService } from 'src/app/modules/auth/_services/save-addres.service';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  map: any;
  marker: any;
  address: string = '';
  observations: string = '';
  userLat: number;
  userLng: number;
  data: any = {};  // Aseguramos que 'data' esté inicializado como un objeto
  alertTypeId: string;

  constructor(private http: HttpClient, private saveAddresService: SaveAddresService, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    // Sobrescribimos los íconos de Leaflet antes de inicializar el mapa
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.map = L.map('map').setView([this.userLat, this.userLng], 13);
          this.loadMapTiles();
        },
        () => {
          this.map = L.map('map').setView([4.7110, -74.0721], 13);
          this.loadMapTiles();
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      this.map = L.map('map').setView([4.7110, -74.0721], 13);
      this.loadMapTiles();
    }
  }

  loadMapTiles(): void {
    if (!this.map) {
      console.error("El mapa no está inicializado.");
      return;
    }
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 5,
    }).addTo(this.map);
  
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
  
      this.addMarker(e.latlng);
  
      this.getAddressFromCoordinates(lat, lng).subscribe({
        next: (address) => {
          this.address = address; // Actualiza la dirección seleccionada
          console.log("Dirección:", this.address);
          L.marker(e.latlng).addTo(this.map).bindPopup(address).openPopup();
        },
        error: (err) => {
          console.error("Error obteniendo la dirección:", err);
          this.address = "Dirección no disponible"; // Manejo en caso de error
          L.marker(e.latlng).addTo(this.map).bindPopup(this.address).openPopup();
        }
      });
      
    });
  }
  

  addMarker(latlng: any): void {
    // Si ya existe un marcador, elimínalo del mapa
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
  
    // Agrega un nuevo marcador
    this.marker = L.marker(latlng).addTo(this.map);
  }
  

  getAddressFromCoordinates(lat: number, lng: number): Observable<string> {
    const url = `https://cityalertapi-dev.azurewebsites.net/geo/addresses?lat=${lat}&lon=${lng}`;
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<{ Success: boolean; Data: { Address: string } }>(url, { headers }).pipe(
      map((response) => {
        if (response.Success && response.Data && response.Data.Address) {
          return response.Data.Address;
        } else {
          console.warn('Respuesta inesperada:', response);
          return 'Dirección no disponible';
        }
      }),
      catchError((error) => {
        console.error('Error fetching address:', error);
        return of('Unable to retrieve address'); // Retorna un valor por defecto en caso de error
      })
    );
  }
  
  
  
  
  onSubmit(): void {

    const user = this.authService.getUser();
  
    if (!this.address || this.address === 'Dirección no disponible') {
      alert('Por favor selecciona una ubicación válida en el mapa antes de guardar.');
      return;
    }
  
    this.data = {
      UserId: user, // Cambia esto según tu lógica de usuario
      Latitude: this.userLat,
      Longitude: this.userLng,
      Address: this.address,
      Comments: this.observations,
      AlertTypeId: this.alertTypeId,
    };
  
    console.log('Data to save:', this.data);
  
    this.saveAddresService.saveAddress(this.data).subscribe(
      (response) => {
        console.log('Address saved successfully:', response);
        alert('Dirección guardada exitosamente');
      },
      (error) => {
        console.error('Error saving address:', error);
        alert('Error al guardar la dirección. Intenta nuevamente.');
      }
    );
  }
  
}
