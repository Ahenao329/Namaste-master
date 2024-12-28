import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmValidParentMatcher, regExps, errorMessages } from '../../Util/Validaciones.service';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../models/generalModels/usuario.model';
import { usuarioLoginService } from "../../services/generalService/usuarioLogin.service";
import { BaseListPage } from '../../layout/generalPages/BasePages/BaseListPage';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { SessionHelperService } from '../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../shared/enums/commonEnums';
import { UsuarioService } from '../../services/generalService/usuario.service';
import { EnumTipoAlerta } from '../../layout/generalControls/PopUpAlert/popUpAlert.component';
import { RecuperarContrasenaPeticion } from '../../models/generalModels/recuperarContrasenaPeticion.model';
import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';

@Component({
    selector: 'app-establecer-constrasena',
    templateUrl: './recordarContrasena.component.html',
    styleUrls: ['../establecer/establecerContrasena.component.scss'],
    animations: [routerTransition()],
    //providers: [UsuarioService]
})
export class RecordarContrasenaComponent extends BaseListPage implements OnInit {
    _appConfig: IAppConfig = AppConfig;
    usuario: Usuario;
    parametroTexto: string = '';

    _noRobot: boolean = false;

    userForm: FormGroup;
    confirmValidParentMatcher = new ConfirmValidParentMatcher();
    @BlockUI() blockUI: NgBlockUI;// Decorator wires up blockUI instance

    hide = true;    
    _titulo: string = 'Recuperación de contraseña';
    errors = errorMessages;

    constructor
        (private formBuilder: FormBuilder,
        public router: Router,
        public dialog: MatDialog,
        protected _usuarioService: UsuarioService,
        protected _usuarioLoginService: usuarioLoginService,
        protected _sessionHelperService: SessionHelperService

        ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.login);

        this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");

        this.usuario = new Usuario();
    }

    async ngOnInit() {
        this.userForm = this.formBuilder.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.pattern(regExps.email)])]            
        });


    }

    async  onEnviar() {
        try {
            this.blockUI.start();
            let tempPeticion: RecuperarContrasenaPeticion = new RecuperarContrasenaPeticion();
            tempPeticion.email = this.userForm.controls.email.value;

            await this._usuarioLoginService.recuperarContrasena(tempPeticion);
            this._TituloPopup = 'Información';
            this._TipoAlert = EnumTipoAlerta.Confirmacion;
            this._RutaPopUpAlert = '/' + AppConfig.routes.login;
            this._DescripcionPopup = 'El correo electrónico fue enviado correctamente.';
            this.openDialog();
            this.router.navigate(['/' + AppConfig.routes.login]);
        }
        catch (e) {
            this.manejoExcepcion(e, '/' + AppConfig.routes.recordarContrasena);
        } finally {
            this.blockUI.stop();
        }
    }
}