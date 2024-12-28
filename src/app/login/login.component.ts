import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmValidParentMatcher, errorMessages, regExps } from '../Util/Validaciones.service';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../models/generalModels/usuario.model';
import { usuarioLoginService } from "../services/generalService/usuarioLogin.service";
import { BaseListPage } from '../layout/generalPages/BasePages/BaseListPage';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfig } from '../config/app.config';
import { IAppConfig } from '../config/iapp.config';
import { SessionHelperService } from '../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../shared/enums/commonEnums';
import { DataToPersist } from '../models/appModels/dataToPersist.model';
import { SessionData } from 'app/models/appModels/sessionData';
import { SessionStorageHelperService } from 'app/services/helpers/sessionStorageHelper.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,
    //providers: [usuarioLoginService]
})
export class LoginComponent extends BaseListPage implements OnInit {
    _appConfig: IAppConfig = AppConfig;
    usuario: Usuario;
    noCerrarSesion: boolean = true;
    loginForm: FormGroup;
    confirmValidParentMatcher = new ConfirmValidParentMatcher();
    @BlockUI() blockUI: NgBlockUI;// Decorator wires up blockUI instance

    errors = errorMessages;

    constructor
        (
            private formBuilder: FormBuilder,
            public router: Router,
            public dialog: MatDialog,
            protected _usuarioLoginService: usuarioLoginService,
            protected _sessionHelperService: SessionHelperService,
            protected _sessionStorageHelperService: SessionStorageHelperService

        ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.login);
        this.usuario = new Usuario();
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
                Validators.pattern(regExps.email),
            ])],
            contrasena: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
            ])]
        });

        let userData: SessionData = this._sessionStorageHelperService.GetSessionData();

        if (userData && userData.userId > 1) {
            if (this._usuarioLoginService.loginBackground())
                this.router.navigate(['/' + AppConfig.routes.dashboard]);
        }
    }

    async onLoggedin() {
        this.marcarControlesParaValidacion(this.loginForm);
        if (this.loginForm.valid) {
            this.blockUI.start();
            try {
                Object.assign(this.usuario, this.loginForm.value);
                await this._usuarioLoginService.login(this.usuario, true);//Que guarde credenciales en localStorage, solo si es desarrollo

                this.router.navigate(['/' + AppConfig.routes.Inicio]);
            }
            catch (e) {
                this.manejoExcepcion(e);
            } finally {
                this.blockUI.stop();
            }
        }
    }


}