import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, AppConfigDin } from '../../../config/app.config';
import { IAppConfig } from '../../../config/iapp.config';
import { DataToPersist } from '../../../models/appModels/dataToPersist.model';
import { LocalStorageHelper } from '../../../services/helpers/localStorageHelper.service';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
//import { Subscription } from '../../../../../node_modules/rxjs/Subscription';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { MessageServiceHelper } from '../../../services/helpers/messageServiceHelper.service';
import { SessionStorageHelperService } from 'app/services/helpers/sessionStorageHelper.service';
import { async } from 'rxjs/internal/scheduler/async';
import { element } from 'protractor';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [usuarioLoginService, MessageServiceHelper]
})
export class SidebarComponent implements AfterViewInit, OnInit {

    public _nombreUsuario: string = '';
    public _perfilUsuario: string = '';


    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    public _appConfig: IAppConfig = AppConfig;

    //Permisos
    _verItemAdministracion: boolean = false;
    _verParametrosFuncionales: boolean = false;
    _verParametrosHTML: boolean = false;
    _verUsuarios: boolean = false;
    _verCargos: boolean = false;
    _verAreas: boolean = false;
    _verDiasFestivos: boolean = false;
    _verContenidoAdicionalCorreo: boolean = false;
    _verCategoriaHerramientaCaja: boolean = false;
    _verHerramientaCaja: boolean = false;
    _verHerramientaCajaConsultar:boolean=false;
    _verBotonPanico:boolean=false;
    _verTipoEmocion:boolean=false;
    _verCategoriaHerramientaListarPopupComponent=false;


    //Negocio
    _verItemNegocio: boolean = false;

    //Informes
    _verItemInformes: boolean = false;
    _verReporteDistribucion: boolean = false;
    _verReporteHistograma: boolean = false;


    message: any;
    //subscription: Subscription;

    constructor(private translate: TranslateService, public router: Router
        , protected _localStorageHelper: LocalStorageHelper
        , protected _sessionHelperService: SessionHelperService
        , protected _usuarioLoginService: usuarioLoginService
        , public _messageServiceHelper: MessageServiceHelper
        , protected _sessionStorageHelperService: SessionStorageHelperService) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });

    }

    async ngOnInit() {
        /*this.subscription = this._messageServiceHelper.getMessage().subscribe(message => { 
            this.message = message; 
            this.message = '';
        });*/
    }

    async ngAfterViewInit() {
        try {
            setTimeout(() => {//Esta parte solo aplica cuando se recompila en dllo, mientras loginBackground carga los recursosXperfil
                this.prepararMenu();
            }, 500);
        } catch (error) {
        }

    }

    prepararMenu() {

        if (!this._sessionHelperService.existeSesion()) {
            setTimeout(() => {
                this.prepararMenu();
            }, 500);
            return;
        }

        this._verParametrosFuncionales = this._sessionHelperService.getPermisosRecurso(EnumRecursos.ParametroFuncional).Opcional1;
        this._verParametrosHTML = this._sessionHelperService.getPermisosRecurso(EnumRecursos.ParametroHTML).Opcional1;

        this._verUsuarios = this._sessionHelperService.getPermisosRecurso(EnumRecursos.Usuario).Opcional1;

        this._verCargos = this._sessionHelperService.getPermisosRecurso(EnumRecursos.Cargo).Opcional1;

        this._verAreas = this._sessionHelperService.getPermisosRecurso(EnumRecursos.Area).Opcional1;

        this._verDiasFestivos = this._sessionHelperService.getPermisosRecurso(EnumRecursos.DiaFestivo).Opcional1;

        this._verContenidoAdicionalCorreo = this._sessionHelperService.getPermisosRecurso(EnumRecursos.MaterialAdicionalCorreo).Opcional1;

        this._verReporteDistribucion = this._sessionHelperService.getPermisosRecurso(EnumRecursos.ReporteDistribucion).Opcional1;

        this._verReporteHistograma = this._sessionHelperService.getPermisosRecurso(EnumRecursos.ReporteHistograma).Opcional1;

        this._verCategoriaHerramientaCaja=this._sessionHelperService.getPermisosRecurso(EnumRecursos.CategoriaHerramientaCaja).Opcional1;

        this._verHerramientaCaja=this._sessionHelperService.getPermisosRecurso(EnumRecursos.HerramientaCaja).Opcional1;

        this._verHerramientaCajaConsultar=this._sessionHelperService.getPermisosRecurso(EnumRecursos.HerramientaCaja).Opcional1;
        
        this._verBotonPanico=this._sessionHelperService.getPermisosRecurso(EnumRecursos.BotonPanico).Opcional1;

        this._verTipoEmocion=this._sessionHelperService.getPermisosRecurso(EnumRecursos.DiaFestivo).Opcional1;

        this._verCategoriaHerramientaListarPopupComponent=this._sessionHelperService.getPermisosRecurso(EnumRecursos.CategoriaHerramientaCaja).Opcional1;
        


        this._verItemAdministracion = this._verParametrosFuncionales || this._verUsuarios || this._verParametrosHTML || this._verCargos
            || this._verAreas || this._verDiasFestivos || this._verContenidoAdicionalCorreo ||   this._verCategoriaHerramientaCaja
            || this._verHerramientaCaja;


        this._verItemNegocio =  this._verHerramientaCajaConsultar || this._verBotonPanico;

        this._verItemInformes = this._verReporteDistribucion || this._verReporteHistograma;



        try {
            this._nombreUsuario = this._sessionHelperService.getSessionUser().nombre;

            this._perfilUsuario = this._sessionHelperService.getSessionUser().perfilNombre;

        } catch (error) {
        }
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
        this._sessionStorageHelperService.RemoveSessionData();
    }

    onAyuda() {
        let ruta: string = AppConfigDin.settings.apiServer.urlSite;
        ruta = ruta + 'Ayuda/HowTo.html';
        window.open(ruta, '_blank');
    }
}
