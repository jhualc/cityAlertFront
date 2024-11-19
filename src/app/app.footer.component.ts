import {Component, OnInit} from '@angular/core';
import { AuthService } from './modules/auth/_services/auth.service';
import { PersonaDataService } from './demo/service/persona-data.service';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
			<div >
				<a href="#/dash">
					<img src="assets/layout/images/logo_texto.svg" alt="mirage-layout" height="40" />
				</a>
				<div class="text">
				</div>
			</div>
			<div class="icons">
				<div class="icon">
					<!-- <i class="pi pi-home"></i> -->
				</div>
				<div class="icon">
					<!--<a href="#/pages/acerca"><i class="pi pi-twitter"></i></a>-->
				</div>
				<div class="icon" *ngIf="isAccepted" (click)="handle(true)">
				<a href="#/dash"><i class="pi pi-lock"></i></a>
				</div>
				<div class="icon" >
					<a href="#/pages/acerca"><i class="pi pi-info-circle"></i></a>
				</div>
				
			</div>
        </div>

		  
<div class="login-body" [ngClass]="">
    <!-- Contenido existente -->
    <p-dialog header="Autorización de Uso de Datos Personales" [(visible)]="displayModal" [modal]="true" [style]="{'width': '50vw', 'text-align': 'left'}" class="modal-autorizacion">

      <div class="content">
        <p>En mi calidad de titular de datos personales, al aceptar de manera voluntaria este formulario, autorizo a los organizadores 
            del evento 3er Congreso Internacional de Hidrógeno a utilizar la información que a continuación suministraré con el propósito 
            de que sea usada para el desarrollo de la presente actividad, establecer contacto para envío de memorias o información 
            pertinente al evento, entrega de certificados, adelantar la promoción y publicidad relacionada con productos y servicios 
            que ofrecen las asociaciones, promoción y publicidad de la presente actividad y actividades futuras.

            Conozco la Política de Tratamiento y Protección de Datos Personales la cual puede ser consultada en el 
            
            <b><a href= "https://www.hidrogenocolombia.com/wp-content/uploads/2023/07/Politica-de-proteccion-de-datos-V-27042023.pdf">Siguiente enlace</a></b>
        </p>
           
      </div>
      <p-footer>
        <button type="button" pButton label="No" (click)="handleAuthorization(false)" class="ui-button-secondary"></button>
        <button type="button" pButton label="Autorizo" (click)="handleAuthorization(true)" class="ui-button-success"></button>
        
      </p-footer>
    </p-dialog>
  </div>
    `
})



export class AppFooterComponent implements OnInit {

	user:any = null;
	isAccepted: boolean = false;
	displayModal: boolean = false;
	
 constructor(private authService: AuthService,
			private PersonaDataService: PersonaDataService){}
	
      ngOnInit() {
        try {
          // Verifica si el usuario está autenticado
          if (!this.authService.isLogin()) {
            this.authService.logout();
            return;
          }
      
          // Intenta obtener los datos del usuario desde localStorage
          const userString = localStorage.getItem("user");
          this.user = userString ? JSON.parse(userString) : null;
      
          if (!this.user || !this.user.id) {
            console.error("Error: No se pudo recuperar el usuario o falta el ID.");
            this.authService.logout();
            return;
          }
      
          console.log("USERID:::", this.user);
      
          // Realiza la solicitud para obtener información adicional del usuario
          this.PersonaDataService.getUser(this.user.id).subscribe({
            next: (respuesta) => {
              if (respuesta && (respuesta as any).user?.usr_datos_personales === 0) {
                this.isAccepted = true;
              } else {
                console.warn("Los datos de la respuesta no son válidos:", respuesta);
              }
            },
            error: (error) => {
              console.error("Error al autorizar datos de la persona:", error);
          
              // Manejo de errores comunes
              if (error.status === 0) {
                console.error(
                  "No se pudo conectar al servidor. Verifica la URL o la conectividad."
                );
              } else if (error.status >= 400 && error.status < 500) {
                console.error(
                  "Error del cliente. Verifica los datos enviados en la solicitud.",
                  error.message
                );
              } else if (error.status >= 500) {
                console.error(
                  "Error del servidor. Es posible que el backend tenga un problema."
                );
              }
            },
          });
          
        } catch (error) {
          console.error("Error en ngOnInit:", error);
          this.authService.logout();
        }
      }
      
	
	handleAuthorization(accepted: boolean) {

        
        this.displayModal = false; 

        if(this.authService.isLogin()){
            this.user = JSON.parse(localStorage.getItem("user") ?? '');
            if (this.user.avatar==null || this.user.avatar==""){
                this.user.avatar="users/non-avatar.svg";
            }
          }

          const data = {
            id: this.user.id,
            datosPersonales: accepted
          };

          
          
        if (accepted) {
           
          console.log('Usuario autorizado.');
		  
        } else {
        
          console.log('Usuario no autorizó.');
		  
        }
        
        this.PersonaDataService.setPersonaDataAuthorization(data)
          .subscribe({
            next: (respuesta) =>{
             
             this.irAPaginaDestino();
            },
            error: (error) => {
              
            }
            
        })
       
		  
      }

	  handle(show: boolean){

		this.displayModal = true; 
	}

	irAPaginaDestino() {
        location.reload();
      }

}
