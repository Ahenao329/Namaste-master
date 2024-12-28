import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfirmValidParentMatcher, regExps, CustomValidators, errorMessages } from '../../Util/Validaciones.service';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../models/generalModels/usuario.model';
import { usuarioLoginService } from "../../services/generalService/usuarioLogin.service";
import { BaseListPage } from '../../layout/generalPages/BasePages/BaseListPage';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfig, AppConfigDin } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { SessionHelperService } from '../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../shared/enums/commonEnums';
import { UsuarioService } from '../../services/generalService/usuario.service';
import { EnumTipoAlerta } from '../../layout/generalControls/PopUpAlert/popUpAlert.component';
import { EstablecerContrasenaPeticion } from '../../models/generalModels/establecerContrasenaPeticion.model';
import { EstablecerContrasenaRespuesta } from '../../models/generalModels/establecerContrasenaRespuesta.model';

@Component({
    selector: 'app-establecer-constrasena',
    templateUrl: './establecerContrasena.component.html',
    styleUrls: ['./establecerContrasena.component.scss'],
    animations: [routerTransition()],
    providers: [UsuarioService]
})
export class EstablecerContrasenaComponent extends BaseListPage implements OnInit {
    _appConfig: IAppConfig = AppConfig;
    usuario: Usuario;
    parametroTexto: string = '';

    loginForm: FormGroup;
    confirmValidParentMatcher = new ConfirmValidParentMatcher();
    @BlockUI() blockUI: NgBlockUI;// Decorator wires up blockUI instance

    public apiServer = AppConfigDin.settings.apiServer;

    hide = true;
    _titulo: string = 'Establecer contraseña';
    errors = errorMessages;

    constructor
        (private route: ActivatedRoute,
            private formBuilder: FormBuilder,
            public router: Router,
            public dialog: MatDialog,
            protected _usuarioService: UsuarioService,
            protected _usuarioLoginService: usuarioLoginService,
            protected _sessionHelperService: SessionHelperService

        ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.login);
        this.usuario = new Usuario();
    }

    async ngOnInit() {
        this.loginForm = this.formBuilder.group({
            passwordGroup: new FormGroup({
                password: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.pattern(regExps.password)
                ])),
                confirmPassword: new FormControl('',
                    Validators.required
                )
            },
                (formGroup: FormGroup) => {
                    return CustomValidators.areEqual(formGroup);
                }
            )
        });

        //consultar token
        let id: string = '';
        this.route.params.forEach((params: Params) => {
            id = params['id'];
        });

        if (id == '') {
            this._TituloPopup = 'Error';
            this._TipoAlert = EnumTipoAlerta.Error;
            this._RutaPopUpAlert = 'not-found';
            this._DescripcionPopup = "Parámetros incorrectos";

            this.openDialog();
        }
        else {
            this.parametroTexto = id;

            let tempPeticion: EstablecerContrasenaPeticion = new EstablecerContrasenaPeticion();
            tempPeticion.token = id;

            this.blockUI.start();
            try {
                let respuesta: EstablecerContrasenaRespuesta = await this._usuarioLoginService.validarTokenEstablecerContrasena(tempPeticion);

                if ((respuesta == null || respuesta.id == 0)) {
                    this._TituloPopup = 'Error';
                    this._TipoAlert = EnumTipoAlerta.Error;
                    this._RutaPopUpAlert = 'not-found';
                    this._DescripcionPopup = respuesta.mensaje;
                    this.openDialog();
                }
            }
            catch (e) {
                this.manejoExcepcion(e, '/not-found');
            } finally {
                this.blockUI.stop();
            }

        }
    }

    async  onGuardar() {
        this.blockUI.start();
        try {
            let tempPeticion: EstablecerContrasenaPeticion = new EstablecerContrasenaPeticion();
            tempPeticion.token = this.parametroTexto;
            tempPeticion.contrasena = this.loginForm.controls.passwordGroup.get('password').value;

            await this._usuarioLoginService.establecerContrasena(tempPeticion);
            this._TituloPopup = 'Información';
            this._TipoAlert = EnumTipoAlerta.Confirmacion;
            this._RutaPopUpAlert = '/' + AppConfig.routes.login;
            this._DescripcionPopup = 'La contraseña se estableció correctamente.';
            this.openDialog();
            this.router.navigate(['/' + AppConfig.routes.login]);
        }
        catch (e) {
            this.manejoExcepcion(e);
        } finally {
            this.blockUI.stop();
        }
    }
}