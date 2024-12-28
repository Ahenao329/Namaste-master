import { Component, OnInit, ViewChild, ElementRef, Inject, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseEditPage } from 'app/layout/generalPages/BasePages/BaseEditPage';
import { AppConfigDin } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { UsuarioService } from "../../../services/generalService/usuario.service";
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Usuario } from '../../../models/generalModels/usuario.model';
import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { errorMessages } from 'app/Util/Validaciones.service';

@Component({
    selector: 'app-popup-foto',
    templateUrl: './popup-foto.template.html',
    styleUrls: ['./popup-foto.component.scss'],
    animations: [routerTransition()]
})

export class PopUpFotoComponent extends BaseEditPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;
    protected apiServer = AppConfigDin.settings.apiServer;
    userForm: FormGroup;
    public modelo: Usuario;

    _mostrarDivError: boolean = false;
    _errorMostrar: string = '';
    _rutaImagenExistente: string = '';

    _mostrarDatosProfesor: boolean = false;

    errors = errorMessages;

    @ViewChild('inputFileUpload', { static: false })
    myInputVariable: ElementRef;

    @Output() imagen = new EventEmitter<Usuario>();

    constructor(
        public dialogRef: MatDialogRef<PopUpFotoComponent>,
        @Inject(MAT_DIALOG_DATA) public _usuario: Usuario,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioService: UsuarioService,
        protected _usuarioLoginService: usuarioLoginService,

        private formBuilder: FormBuilder,
        public dialog: MatDialog    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);

        this._recurso = EnumRecursos.Usuario;
        this._urlRetorno = "/";
        this._tituloBase = "Editar mi perfil";

        this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");
       
        this.modelo = this._usuario;

        this.userForm = this.formBuilder.group({
            nombre: ['', [Validators.required]]
           
        });
    }

    async ngOnInit() {
        this.obtenerPermisos();


        try {
            this.blockUI.start();

            this.modelo = await this._usuarioService.buscar(this._sessionHelperService.getSessionUser().idUsuario);


            if (this.modelo != null && this.modelo.rutaImagenFrontEnd.length > 0)
                this._rutaImagenExistente = this.apiServer.urlSite + this.modelo.rutaImagenFrontEnd;

            this.userForm.controls.nombre.setValue(this.modelo.nombre);
           
            await this.llenarListas();
        }
        catch (e) {
            this.manejoExcepcion(e, this._urlRetorno);
        }
        finally {
            this.blockUI.stop();
        }
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    async onImagenSeleccionada(imagenBase64: string) {
        this.modelo.imagenBase64 = imagenBase64;
    }

    async onSubmit() {
        let result: Usuario;

        this.marcarControlesParaValidacion(this.userForm);

        if (this.userForm.valid && this.validarEntradas()) {
            try {
                this.blockUI.start();
              
                this.modelo.nombre = this.userForm.controls.nombre.value.trim();

                result = await this._usuarioService.editarMiPerfil(this.modelo);

                this._sessionHelperService.actualizarNombreUsuarioMostrar(this.modelo.nombre);

                this.imagen.emit(result);
                this.onNoClick();
            }
            catch (e) {
                this.manejoExcepcion(e);
            }
            finally {
                this.blockUI.stop();
            }
        }
    }

  
    //Métodos
    validarEntradas(): boolean {
        let retorno: boolean = true;

        if (!this.modelo.rutaImagenFrontEnd && !this.modelo.imagenBase64) {
            this.manejoErrorLocal("La imagen es requerida.");
            retorno = false;
        }

        return retorno;
    }

    mostrarErrorImagenes(error) {
        console.log(error);

        this.manejoErrorLocal("No fue posible procesar la imagen. Error: " + error);
    }

    manejoErrorLocal(mensaje: string) {

        this._mostrarDivError = true;
        this._errorMostrar = mensaje;

        setTimeout(() => {
            this._mostrarDivError = false;
        }, 5000);

    }

    async llenarListas() {
            
   }

} 