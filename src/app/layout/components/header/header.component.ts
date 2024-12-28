import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageHelper } from '../../../services/helpers/localStorageHelper.service';
import { DataToPersist } from '../../../models/appModels/dataToPersist.model';
import { SessionStorageHelperService } from 'app/services/helpers/sessionStorageHelper.service';
import { SessionData } from 'app/models/appModels/sessionData';
import { AvatarUsuarioComponent } from 'app/layout/generalControls/avatar-usuario/avatar-usuario.component';
import { AppConfigDin, AppConfig } from 'app/config/app.config';
import { IAppConfig } from 'app/config/iapp.config';
import { Subscription } from 'rxjs';
import { MessageServiceHelper } from 'app/services/helpers/messageServiceHelper.service';
import { EnumPerfiles } from 'app/shared/enums/commonEnums';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    protected apiServer = AppConfigDin.settings.apiServer;
    _appConfig: IAppConfig = AppConfig;

    private messageSubscription: Subscription = new Subscription();

    pushRightClass: string = 'push-right';
    public usuario: string = ''
    public _sessionData: SessionData;

    public _mostrarProfile: boolean = false;

    public _mostrarItemGestion: boolean = false;

    public _mostrarDescargarApp: boolean = false;

    @Input("onUserProfile") userProfile: Function;
    @Input("publicMode") publicMode: boolean;


    @ViewChild(AvatarUsuarioComponent, { static: true })
    private avatarUsuarioInstance: AvatarUsuarioComponent;

    constructor(private translate: TranslateService
        , public router: Router
        , protected _localStorageHelper: LocalStorageHelper
        , protected _sessionStorageHelperService: SessionStorageHelperService
        , protected _messageHelper: MessageServiceHelper
    ) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
        this.usuario = localStorage.getItem("nombreUsuario");

        //Este evento se dispara cuando cambia el Avatar en la cuenta de usuario.
        this.messageSubscription = this._messageHelper.cambioAvatarSourceObs$.subscribe((param: any) => {
            setTimeout(() => {
                this.onCambioAvatar();
            }, 200);
        });
    }

    ngOnInit() {
        this.usuario = localStorage.getItem("nombreUsuario");

        this._sessionData = this._sessionStorageHelperService.GetSessionData();

        if (this._sessionData && this._sessionData.userId > 1) {
            this._mostrarProfile = true;

            if (this._sessionData.roleId != EnumPerfiles.Publico) {
                this._mostrarItemGestion = true;
            }

        }

        this.onCambioAvatar();
    }

    ngOnDestroy() {
        //IMPORTANTE: liberar memoria y evitar otros comportamientos indeseados
        this.messageSubscription.unsubscribe();
    }


    onCambioAvatar() {
        this._sessionData = this._sessionStorageHelperService.GetSessionData();

        if (this._sessionData && this._sessionData.imagen && this._sessionData.imagen.length > 0)
            this.avatarUsuarioInstance.rutaImagen = this.apiServer.urlSite + this._sessionData.imagen;
        else
            this.avatarUsuarioInstance.rutaImagen = "assets/config/cliente/images/userdefault.png";
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

    onUserProfile() {
        if (this.userProfile) {
            this.userProfile();
        }
    }

    /*onLoggedout() {
        localStorage.removeItem('isLoggedin');
        this._sessionStorageHelperService.RemoveSessionData();
    }*/

    changeLang(language: string) {
        this.translate.use(language);
    }
}
