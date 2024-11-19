import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AuthService} from './modules/auth/_services/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];
    user: any = null;

    constructor(public appMain: AppMainComponent,
		private authService: AuthService
        ) {
        }

    ngOnInit() {
        this.model = [
            {label: 'Registrar Alerta', icon: 'pi pi-fw pi-home', routerLink: ['/inicio']},
            {label: 'Reporte Alertas', icon: 'pi pi-fw pi-calendar', routerLink: ['/reporte']},
            {label: 'Otros Reportes', icon: 'pi pi-fw pi-megaphone', routerLink: ['pages/acerca']},
            {label: 'Acerca de', icon: 'pi pi-fw pi-send', routerLink: ['pages/acerca']},
           // {label: 'Patrocinadores', icon: 'pi pi-fw pi-bars', routerLink: ['pages/sponsors']},
/*             {
                label: 'Agenda', icon: 'pi pi-fw pi-star-fill', routerLink: ['/uikit'],
                items: [
                    {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout']},
                    {label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input']},
                    {label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel']},
                    {label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate']},
                    {label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon'},
                    {label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table']},
                    {label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list']},
                    {label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree']},
                    {label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel']},
                    {label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay']},
                    {label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media']},
                    {label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true},
                    {label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message']},
                    {label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file']},
                    {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts']},
                    {label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc']}
                ]
            }, */
/*             {
                label:'Participantes', icon:'pi pi-fw pi-prime', routerLink: ['/blocks'],
                items:[
                    {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks']},
                    {label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank'},
                ]
            },
            {
                label: 'Speakers', icon: 'pi pi-fw pi-compass', routerLink: ['/utilities'],
                items: [
                    {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['utilities/icons']},
                    {label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank'},
                ]
            },
            {
                label: 'Networking', icon: 'pi pi-fw pi-copy', routerLink: ['/pages'],
                items: [
                    {label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud']},
                    {label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/calendar']},
                    {label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline']},
                    { label: 'Landing', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank' },
                    { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'], target: '_blank' },
                    { label: 'Error', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/error'], target: '_blank' },
                    { label: '404', icon: 'pi pi-fw pi-times', routerLink: ['/404'], target: '_blank' },
                    {label: 'Access Denied', icon: 'pi pi-fw pi-ban', routerLink: ['/accessdenied'], target: '_blank'},
                    { label: 'Empty', icon: 'pi pi-fw pi-clone', routerLink: ['/pages/empty'] },
                ]
            }, */
/*             {
                label: 'Chat', icon: 'pi pi-fw pi-send', routerLink: ['chat'],
                items: [
                    {label: 'Mensajes', icon: 'pi pi-fw pi-inbox', routerLink: ['chat']},
                                    ]
            }, */
          //  {label: 'Registrar Usuario', icon: 'pi pi-fw pi-user-plus', routerLink: ['pages/register']},
            /*,
            {
                label: 'Hierarchy', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-sign-in',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-sign-in',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-sign-in' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-sign-in' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-sign-in' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-sign-in',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-sign-in' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-sign-in',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-sign-in',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-sign-in' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-sign-in' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-sign-in',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-sign-in' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Docs', icon: 'pi pi-fw pi-file', routerLink: ['/documentation']
            },
            {
                label: 'Buy Now', icon: 'pi pi-fw pi-money-bill', url: ['https://www.primefaces.org/store']
            }
 */
        //    {label: 'Información Evento', icon: 'pi pi-fw pi-info-circle', routerLink: ['pages/acerca']},
        ];

        if (this.authService.isLogin()) {
            try {
              const userString = localStorage.getItem("user");
              this.user = userString ? JSON.parse(userString) : null;
          
              if (this.user?.perfil === null || this.user?.perfil === "Invitado") {
                if (Array.isArray(this.model)) {
                  const index = this.model.findIndex(p => p.label === "Registrar Usuario");
                  if (index !== -1) {
                    this.model.splice(index, 1); // Elimina la opción "Registrar Usuario"
                  }
                } else {
                  console.warn("El modelo de menú (this.model) no está inicializado o no es un array.");
                }
              }
            } catch (error) {
              console.error("Error al procesar los datos del usuario:", error);
            }
          }
             
    }

    onMenuClick() {
        this.appMain.topbarMobileMenuActive=false;
        this.appMain.menuClick = true;
    }

}
