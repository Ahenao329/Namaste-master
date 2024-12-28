import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';

import { ConfirmValidParentMatcher, regExps, CustomValidators, errorMessages } from '../../../Util/Validaciones.service';
import { IAppConfig } from '../../../config/iapp.config';
import { UsuarioService } from '../../../services/generalService/usuario.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseEditPage } from '../../../layout/generalPages/BasePages/BaseEditPage';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from "../../../services/generalService/usuarioLogin.service";


import { Usuario } from '../../../models/generalModels/usuario.model';
import { EnumTipoAlerta } from '../../../layout/generalControls/PopUpAlert/popUpAlert.component';
import { CambiarContrasenaPeticion } from '../../../models/generalModels/cambiarContrasenaPeticion.model';
import { EstablecerContrasenaRespuesta } from '../../../models/generalModels/establecerContrasenaRespuesta.model';
import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';

@Component({
    selector: 'app-cambiar-constrasena',
    templateUrl: './cambiarContrasena.component.html',
    styleUrls: ['./cambiarContrasena.component.scss'],
    //providers: [UsuarioService]
})
export class CambiarContrasenaComponent extends BaseEditPage implements OnInit {
    public id: number = 0;
    public modelo: Usuario;
    _appConfig: IAppConfig = AppConfig;
    loginForm: FormGroup;
    errors = errorMessages;

    confirmValidParentMatcher = new ConfirmValidParentMatcher();
    @BlockUI() blockUI: NgBlockUI;// Decorator wires up blockUI instance

    hide = true;
    
    constructor(private route: ActivatedRoute,
        public router: Router,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioService: UsuarioService,
        protected _usuarioLoginService: usuarioLoginService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog

    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);
        this._urlRetorno = '/' + AppConfig.routes.dashboard;
        this._tituloBase = 'Cambiar contraseña';
        this.modelo = new Usuario();

        this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");

        this.loginForm = this.formBuilder.group({
            passwordActual: ['', [Validators.required]],
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
    }

    async ngOnInit() {
        await this.obtenerPermisos();
        this.blockUI.start();
        this.id = this._sessionHelperService.SERVICEAUTHDATA.userId;
        console.log(this.id);
        try {
            this.parametro = this.prepararIdNumero(this.id.toString(), this._urlRetorno);
            if (this.parametro != 0) {
                this.modelo = await this._usuarioService.buscar(this.parametro);
                this.titulo = this._tituloBase;
            }
        }
        catch (e) {
            this.manejoExcepcion(e, this._urlRetorno);
        }
        finally {
            this.blockUI.stop();
        }
    }

    async  onGuardar() {
        this.blockUI.start();
        try {
            let tempPeticion: CambiarContrasenaPeticion = new CambiarContrasenaPeticion();
            console.log(tempPeticion);
            tempPeticion.contrasena = this.loginForm.get("passwordGroup.password").value;            
            tempPeticion.contrasenaActual = this.loginForm.controls.passwordActual.value;

            let respuesta = await this._usuarioService.cambiarContrasena(tempPeticion);
            if (respuesta.mensaje == 'Ok') {
                this.modelo.contrasena= this.loginForm.get("passwordGroup.password").value;
                this._usuarioLoginService.login(this.modelo, true);
                this._TituloPopup = 'Información';
                this._TipoAlert = EnumTipoAlerta.Confirmacion;
                this._RutaPopUpAlert = '/' + AppConfig.routes.login;
                this._DescripcionPopup = 'La contraseña se cambió correctamente.';
                this.openDialog();
                //this.router.navigate([this._urlRetorno]);
            }
            else
            {
                this._TituloPopup = 'Error';
                this._TipoAlert = EnumTipoAlerta.Error;
                this._RutaPopUpAlert = '/' + AppConfig.routes.CambiarContra;;
                this._DescripcionPopup = "No fue posible cambiar la contraseña, por favor verifique la contraseña actual.";          
                this.openDialog();
            }
        }
        catch (e) {
            this.manejoExcepcion(e);
        } finally {
            this.blockUI.stop();
        }
    }
}