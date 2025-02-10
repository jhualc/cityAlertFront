import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as L from 'leaflet';
import { SaveAddresService } from 'src/app/modules/auth/_services/save-addres.service';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import swal from 'sweetalert2'

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  providers: [MessageService, ConfirmationService],
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

  tiposAlerta: { id: string; descripcion: string }[] = [
    { id: '1', descripcion: 'Huecos' },
    { id: '2', descripcion: 'Iluminación' },
    { id: '3', descripcion: 'Peligro' }
  ];

  constructor(private http: HttpClient, private saveAddresService: SaveAddresService, private authService: AuthService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private location: Location,
              private router: Router
  ) {}

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
          this.map = L.map('map').setView([this.userLat, this.userLng], 20);
          this.loadMapTiles();
  
          // Agregar marcador inicial
          this.addMarker({ lat: this.userLat, lng: this.userLng });
  
          // Obtener la dirección inicial
          this.getAddressFromCoordinates(this.userLat, this.userLng).subscribe({
            next: (address) => {
              this.address = address;
              console.log("Dirección inicial:", this.address);
  
              // Asignar la dirección al marcador inicial
              if (this.marker) {
                this.marker.bindPopup(this.address).openPopup();
              }
            },
            error: (err) => {
              console.error("Error obteniendo la dirección inicial:", err);
              this.address = "Dirección no disponible";
  
              if (this.marker) {
                this.marker.bindPopup(this.address).openPopup();
              }
            }
          });
        },
        () => {
          this.map = L.map('map').setView([4.7110, -74.0721], 20);
          this.loadMapTiles();
        }
      );
    } else {
      //alert('Geolocation is not supported by this browser.');
      //this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Geolocation is not supported by this browser.', life: 3000 })
      swal.fire({
        title: 'Registrar Alerta!', 
        text: 'Geolocalización no es soportada por este navegador.', 
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5E81AC'
      });
      this.map = L.map('map').setView([4.7110, -74.0721], 17);
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
  
      // Actualiza las coordenadas seleccionadas
      this.userLat = lat;
      this.userLng = lng;
  
      // Llamamos a la función para actualizar el marcador en la nueva ubicación
      this.addMarker(e.latlng);
  
      // Obtener la dirección basada en las coordenadas
      this.getAddressFromCoordinates(lat, lng).subscribe({
        next: (address) => {
          this.address = address;
          console.log("Dirección:", this.address);
  
          // Actualiza solo el popup del marcador existente, sin agregar más marcadores
          if (this.marker) {
            this.marker.bindPopup(address).openPopup();
          }
        },
        error: (err) => {
          console.error("Error obteniendo la dirección:", err);
          this.address = "Dirección no disponible";
  
          if (this.marker) {
            this.marker.bindPopup(this.address).openPopup();
          }
        }
      });
    });
  }
  
  addMarker(latlng: any): void {
    // Si ya existe un marcador, elimínalo antes de agregar uno nuevo
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
  
    // Crea un nuevo marcador y asígnalo a la variable global
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
  

  centerMap() {
    if (this.map) {
      this.map.setView([this.userLat, this.userLng], 20); // Mueve la vista sin inicializar nuevamente
  
      // Mueve el marcador a la ubicación original
      if (this.marker) {
        this.marker.setLatLng([this.userLat, this.userLng]);
      } else {
        // Si no hay un marcador, agrégalo
        this.marker = L.marker([this.userLat, this.userLng]).addTo(this.map);
      }
    }
  }
  
  GoBack()
  {
    this.location.back(); 
  }
  
  
  onSubmit(): void {

    const user = this.authService.getUser();
  
    if (!this.address || this.address === 'Dirección no disponible') {
      //this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Por favor selecciona una ubicación válida en el mapa antes de guardar.', life: 3000 })
      //alert('Por favor selecciona una ubicación válida en el mapa antes de guardar.');
      swal.fire({
        title: 'Registrar Alerta!', 
        text: 'Por favor selecciona una ubicación válida en el mapa antes de guardar.', 
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5E81AC'
      });
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
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Dirección guardada exitosamente', life: 3000 });
        swal.fire({
          title: 'Registrar Alerta!', 
          text: 'Alerta registrada exitosamente!', 
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#5E81AC'
        });
        this.router.navigate(['/reporte']); 
        //alert('Dirección guardada exitosamente' );
      },
      (error) => {
        console.error('Error saving address:', error);
        //this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al guardar la dirección. Intenta nuevamente.', life: 3000 })
        swal.fire({
          title: 'Registrar Alerta!', 
          text: 'Error al guardar la dirección. Intenta nuevamente.', 
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#5E81AC'
        });
        //alert('Error al guardar la dirección. Intenta nuevamente.');
      }
    );
  }
  
}
