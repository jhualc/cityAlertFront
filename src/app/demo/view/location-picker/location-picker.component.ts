import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { SaveAddresService } from 'src/app/modules/auth/_services/save-addres.service';

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

  constructor(private http: HttpClient, private saveAddresService: SaveAddresService) {}

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.addMarker(e.latlng);
      this.getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
    });
  }

  addMarker(latlng: any): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(latlng).addTo(this.map);
  }

  getAddressFromCoordinates(lat: number, lng: number): void {
    const url = `https://cityalertapi-dev.azurewebsites.net/geo/addresses?lat=${lat}&lon=${lng}`;
  
    // No es necesario especificar 'responseType' si deseas que Angular maneje la respuesta como JSON por defecto
    this.http.get<{ Address: string }>(url).subscribe(
      (response) => {
        // Accedemos a la propiedad 'Address' de la respuesta JSON
        this.address = response.Address;
      },
      (error) => {
        console.error('Error fetching address:', error);
        this.address = 'Unable to retrieve address';
      }
    );
  }
  
  onSubmit(): void {
    this.data = {
      UserId: 1,
      Latitude: this.userLat,
      Longitude: this.userLng,
      Address: this.address,
      Comments: this.observations
      
    };

    // Logueamos los datos para depuración
    console.log('Data to save:', this.data);

    // Llamamos al servicio para guardar la dirección
    this.saveAddresService.saveAddress(this.data).subscribe(
      (response) => {
        console.log('Address saved successfully:', response);
      },
      (error) => {
        console.error('Error saving address:', error);
      }
    );
  }
}
