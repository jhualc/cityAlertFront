import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {BreadcrumbService} from '../../breadcrumb.service';
import {ProductService} from '../service/productservice';
import {Product} from '../domain/product';
import {AppConfig} from '../domain/appconfig';
import {ConfigService} from '../service/app.config.service';
import {Subscription} from 'rxjs';
import { AgendaService } from '../service/agenda.service';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaDataService } from '../service/persona-data.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss']
})
export class DashboardDemoComponent implements OnInit {

    lineChartData: any;
    displayModal: boolean = false;
    user:any = null;

    lineChartOptions: any;

    dropdownYears: SelectItem[];

    selectedYear: any;

    activeNews = 1;

    cars: any[];

    selectedCar: any;

    products: Product[];

    events: any[];

    subscription: Subscription;

    config: AppConfig;

    listaPersona: any = [];
    cantPersonas: number = 0;

    listaUsuarios: any = [];
    cantUsuarios: number = 0;

    listaPatrocinadores: any = [];
    cantPatrocinadores: number = 0;
    roleid = localStorage.getItem("role");

    constructor(
        private productService: ProductService, 
        private breadcrumbService: BreadcrumbService, 
        public configService: ConfigService,
        private authService: AuthService,
        private route: Router,
        private agenda: AgendaService,
        private PersonaDataService: PersonaDataService
        ) {

      this.breadcrumbService.setItems([
          {label: 'Dashboard', routerLink: ['/']}
      ]); 
    

      this.config = this.configService.config;
      this.subscription = this.configService.configUpdate$.subscribe(config => {
          this.config = config;
          this.updateChartOptions();
      });
    }

    ngOnInit() {

        

        if(!this.authService.isLogin()){
            this.authService.logout();
          
        }
        this.user = JSON.parse(localStorage.getItem("user") ?? '');
        console.log("USERID:::", this.user);
        
        this.PersonaDataService.getUser(this.user.id)
        .subscribe({
            next: (respuesta) =>{
                if ((respuesta as any).user.usr_datos_personales == 0 || (respuesta as any).user.usr_datos_personales == 1 ){
                    this.displayModal = false;
                    }else{
                        this.displayModal = true;      
                    }
        
            },
            error: (error) => {
              console.error('Error al autorizar datos de la persona', error);
            }
            
        })

        //this.displayModal = true;
        this.cargarDatosParticipantes();
        this.cargarDatosSponsors();
        this.cargarDatosUsuarios();
        this.productService.getProducts().then(data => this.products = data);

        this.lineChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sapphire',
                    data: [1, 2, 5, 3, 12, 7, 15],
                    borderColor: [
                        '#45b0d5'
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                },
                {
                    label: 'Roma',
                    data: [3, 7, 2, 17, 15, 13, 19],
                    borderColor: [
                        '#d08770'
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                }
            ]
        };
        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            fontFamily: '\'Candara\', \'Calibri\', \'Courier\', \'serif\'',
            hover: {
                mode: 'index'
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#9199a9'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#9199a9'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#9199a9'
                    }
                }
            }
        };

        this.dropdownYears = [
            {label: '2019', value: 2019},
            {label: '2018', value: 2018},
            {label: '2017', value: 2017},
            {label: '2016', value: 2016},
            {label: '2015', value: 2015},
            {label: '2014', value: 2014}
        ];
    }
    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        display: false
                    }
                },
            }
        };
    }

    applyLightTheme() {
            this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        display: false
                    }
                },
            }
        };
    }

    cargarDatosParticipantes(){
        this.agenda.get_persona(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
            console.log("Ingreso a poblar la lista");
                  this.listaPersona=resp.persona.filter(p => p.per_tipo_persona==1);
                  this.cantPersonas = this.listaPersona.length;
                  //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })
      }

      cargarDatosSponsors(){
        this.agenda.get_sponsor(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
            console.log("Ingreso a poblar la lista");
                  this.listaPatrocinadores=resp.sponsor;
                  this.cantPatrocinadores = this.listaPatrocinadores.length;
                  //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })
      }
    
      cargarDatosUsuarios(){
        this.agenda.get_users(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
            console.log("Ingreso a poblar la lista");
                  this.listaUsuarios=resp.users;
                  this.cantUsuarios = this.listaUsuarios.length;
                  //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })
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

          
          console.log("USER:::", this.user);
        if (accepted) {
           
          console.log('Usuario autorizado.');
        } else {
        
          console.log('Usuario no autorizó.');
        }

        this.PersonaDataService.setPersonaDataAuthorization(data)
          .subscribe({
            next: (respuesta) =>{
             console.log("REspuesta del servidor", respuesta);
            
            },
            error: (error) => {
              console.error('Error al autorizar datos de la persona', error);
            }
            
        })
      }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    signout() {
        this.authService.logout();
      }
}
