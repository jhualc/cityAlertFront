import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { AuthService} from './modules/auth/_services/auth.service';
import { URL_FILESERVER } from './config/config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
			<div class="layout-topbar-wrapper">
                <div class="layout-topbar-left">
					<div class="layout-topbar-logo-wrapper" >
						<a (click)="irAPaginaDestino('dash')">
							<img src="assets/layout/images/logo_city_alert_red_horizontal.svg" alt="mirage-layout" height="50" />
						</a>
					</div>

					<a href="#" class="sidebar-menu-button" (click)="appMain.onMenuButtonClick($event)">
						<i class="pi pi-bars"></i>
					</a>
<!-- 
					<a href="#" class="megamenu-mobile-button" (click)="appMain.onMegaMenuMobileButtonClick($event)">
						<i class="pi pi-align-right megamenu-icon"></i>
					</a>
-->
					<a href="#" class="topbar-menu-mobile-button" (click)="appMain.onTopbarMobileMenuButtonClick($event)">
						<i class="pi pi-ellipsis-v"></i>
					</a>

					<div class="layout-megamenu-wrapper">
						<!--
						<a class="layout-megamenu-button" href="#" (click)="appMain.onMegaMenuButtonClick($event)">
							<i class="pi pi-comment"></i>
							Mega Menu
						</a>
-->
						<ul class="layout-megamenu" [ngClass]="{'layout-megamenu-active fadeInDown': appMain.megaMenuActive}"
                            (click)="appMain.onMegaMenuClick($event)">
							<li [ngClass]="{'active-topmenuitem': activeItem === 1}" (click)="mobileMegaMenuItemClick(1)">
								<a href="#">JavaServer Faces <i class="pi pi-angle-down"></i></a>
								<ul>
									<li class="active-row ">
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>PrimeFaces</h5>
                                        <span>UI Components for JSF</span>
                                    </span>
									</li>
									<li>
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>Premium Templates</h5>
                                        <span>UI Components for JSF</span>
                                    </span>
									</li>
									<li>
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>Extensions</h5>
                                        <span>UI Components for JSF</span>
                                    </span>
									</li>
								</ul>
							</li>
							<li [ngClass]="{'active-topmenuitem': activeItem === 2}" (click)="mobileMegaMenuItemClick(2)">
								<a href="#">Angular <i class="pi pi-angle-down"></i></a>
								<ul>
									<li>
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>PrimeNG</h5>
                                        <span>UI Components for Angular</span>
                                    </span>

									</li>
									<li>
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>Premium Templates</h5>
                                        <span>UI Components for Angular</span>
                                    </span>
									</li>
								</ul>
							</li>
							<li [ngClass]="{'active-topmenuitem': activeItem === 3}" (click)="mobileMegaMenuItemClick(3)">
								<a href="#">React <i class="pi pi-angle-down"></i></a>
								<ul>
									<li>
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>PrimeReact</h5>
                                        <span>UI Components for React</span>
                                    </span>
									</li>
									<li class="active-row">
										<i class="pi pi-circle-on"></i>
										<span>
                                        <h5>Premium Templates</h5>
                                        <span>UI Components for React</span>
                                    </span>
									</li>
								</ul>
							</li>
						</ul>
					</div>
                </div>
                <div class="layout-topbar-right fadeInDown">
					<ul class="layout-topbar-actions">
					<!--
						<li #search class="search-item topbar-item" [ngClass]="{'active-topmenuitem': appMain.activeTopbarItem === search}">
							<a href="#" class="topbar-search-mobile-button" (click)="appMain.onTopbarItemClick($event,search)">
								<i class="topbar-icon pi pi-search"></i>
							</a>
							<ul class="search-item-submenu fadeInDown" (click)="appMain.topbarItemClick = true">
								<li>
                                    <span class="md-inputfield search-input-wrapper">
                                        <input pInputText placeholder="Search..."/>
                                        <i class="pi pi-search"></i>
                                    </span>
                                </li>
                            </ul>
                        </li>
					-->
						

						

						

						<li #profile class="topbar-item profile-item" [ngClass]="{'active-topmenuitem': appMain.activeTopbarItem === profile}">
							<a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
                            <span class="profile-image-wrapper">
								<div class="avatar avatar-online mr-2"><img src="assets/layout/images/non-avatar.svg" alt="mirage-layout" /></div>
                            </span>
								<span class="profile-info-wrapper">
                                <h3>{{user.name}}</h3>
                                <span>{{user.perfil}}</span>
                            </span>
							</a>
							<ul class="profile-item-submenu fadeInDown">
								<li class="profile-submenu-header">
									<div class="performance">
										<!--<span>Weekly Performance</span>-->
										<img src="assets/layout/images/topbar/asset-bars.svg" alt="mirage-layout" />
									</div>
									<div class="profile">
										<div class="avatar avatar-online mr-2"><img src="{{back}}{{user.avatar}}" alt="mirage-layout"
														width="40" /></div>
										<h1>{{user.name}}</h1>
										<span>{{user.perfil}}</span>
									</div>
								</li>
<!--
								<li class="layout-submenu-item">
									<i class="pi pi-list icon icon-1"></i>
									<div class="menu-text">
										<p>Tasks</p>
										<span>3 open issues</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
								<li class="layout-submenu-item">
									<i class="pi pi-shopping-cart icon icon-2"></i>
									<div class="menu-text">
										<p>Payments</p>
										<span>24 new</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
								<li class="layout-submenu-item">
									<i class="pi pi-users icon icon-3"></i>
									<div class="menu-text">
										<p>Clients</p>
										<span>+80%</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
-->
								<li>
									<i class="pi pi-users icon icon-3"></i>
									<div class="menu-text">
										<a (click)="irAPaginaDestino('pages/perfil')"><p>Cambiar Imagen Perfil</p></a>
									</div>
								</li>										
								<li class="layout-submenu-footer">
									<button class="signout-button" (click)="signout()">Cerrar Sesión</button>
								</li>
							</ul>
						</li>
					<!--
						<li>
							<a href="#" class="layout-rightpanel-button" (click)="appMain.onRightPanelButtonClick($event)">
								<i class="pi pi-arrow-left"></i>
							</a>
						</li>
					-->
                    </ul>

					<ul class="profile-mobile-wrapper">
						<li #mobileProfile class="topbar-item profile-item" [ngClass]="{'active-topmenuitem': appMain.activeTopbarItem === mobileProfile}">
							<a href="#" (click)="appMain.onTopbarItemClick($event,mobileProfile)">
                            <span class="profile-image-wrapper">
							<div class="avatar avatar-online mr-2"><img src="{{back}}{{user.avatar}}"  alt="mirage-layout" /></div>
                            </span>
								<span class="profile-info-wrapper">
                                <h3>{{user.name}}</h3>
                                <span>{{user.perfil}}</span>
                            </span>
							</a>
							<ul class="fadeInDown">
								<li class="profile-submenu-header">
									<div class="performance">
										<!--<span>Weekly Performance</span>-->
										<img src="assets/layout/images/topbar/asset-bars.svg" alt="mirage-layout" />
									</div>
									<div class="profile">
										<div class="avatar avatar-online mr-2"><img src=  "{{back}}{{user.avatar}}" alt="mirage-layout" width="45" /></div>
										<h1>{{user.name}}</h1>
										<span>{{user.perfil}}</span>
									</div>
								</li>
<!-- 								<li>
									<i class="pi pi-list icon icon-1"></i>
									<div class="menu-text">
										<p>Tasks</p>
										<span>3 open issues</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
								<li>
									<i class="pi pi-shopping-cart icon icon-2"></i>
									<div class="menu-text">
										<p>Payments</p>
										<span>24 new</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
								<li>
									<i class="pi pi-users icon icon-3"></i>
									<div class="menu-text">
										<p>Clients</p>
										<span>+80%</span>
									</div>
									<i class="pi pi-angle-right"></i>
								</li>
-->
								<li>
									<i class="pi pi-users icon icon-3"></i>
									<div class="menu-text">
										<a (click)="irAPaginaDestino('pages/perfil')"><p>Cambiar Imagen Perfil</p></a>
									</div>
								</li>								
								<li class="layout-submenu-footer">
									<button class="signout-button" (click)="signout()">Cerrar Sesión</button>

								</li>
							</ul>
						</li>
					</ul>
                </div>
            </div>
        </div>
    `
})
export class AppTopBarComponent {
	activeItem: number;
	user: any = null;
	back: string = URL_FILESERVER + "/storage/";
  
	constructor(
	  public appMain: AppMainComponent,
	  private route: Router,
	  private authService: AuthService
	) {
	  if (this.authService.isLogin()) {
		try {
		  const userString = localStorage.getItem("user");
		  this.user = userString
			? JSON.parse(userString)
			: { avatar: "users/non-avatar.svg" }; // Valor predeterminado
		/*  if (!this.user.avatar) {
			this.user.avatar = "users/non-avatar.svg"; // Validación del avatar
		  }*/
		} catch (error) {
		  console.error("Error parsing user data:", error);
		  this.user = { avatar: "users/non-avatar.svg" }; // Objeto predeterminado en caso de error
		}
	  }
	}
  
	mobileMegaMenuItemClick(index) {
	  this.appMain.megaMenuMobileClick = true;
	  this.activeItem = this.activeItem === index ? null : index;
	}
  
	signout() {
	  this.authService.logout();
	}
  
	irAPaginaDestino(pagina: string) {
	  this.appMain.topbarMobileMenuActive = false;
	  this.route.navigate([pagina]);
	}
  }
  