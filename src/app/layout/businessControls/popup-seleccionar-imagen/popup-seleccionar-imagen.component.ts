import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormGroup } from '@angular/forms';
import { BaseEditPage } from 'app/layout/generalPages/BasePages/BaseEditPage';
import { AppConfigDin } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../../shared/enums/commonEnums';

import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Usuario } from '../../../models/generalModels/usuario.model';

import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-popup-seleccionar-imagen',
    templateUrl: './popup-seleccionar-imagen.template.html',
    styleUrls: ['./popup-seleccionar-imagen.component.scss'],
    animations: [routerTransition()]
})

export class PopupSeleccionarImagenComponent extends BaseEditPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;
    protected apiServer = AppConfigDin.settings.apiServer;
    userForm: FormGroup;
    //public modelo: ExperienciaRecursoVisual;

    _mostrarDivError: boolean = false;
    _errorMostrar: string = '';
    _imagenBase64: string = '';
    _textoAgregarImagen: string = '';
    _rutaImagenExistente: string = '';
    _mostrarNueva: boolean = false;

    showCropper = false;
    //imageUserSelectedBase64:string;
    imageSelectedBlog: Blob;

    @ViewChild('inputFileUpload', { static: false })
    myInputVariable: ElementRef;

    @Output() imagen = new EventEmitter<Usuario>();

    constructor(
        public dialogRef: MatDialogRef<PopupSeleccionarImagenComponent>,
        //@Inject(MAT_DIALOG_DATA) public _recursoVisualIn: ExperienciaRecursoVisual,

        protected _sessionHelperService: SessionHelperService,

        protected _usuarioLoginService: usuarioLoginService,
        public dialog: MatDialog    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);

        this._recurso = EnumRecursos.Usuario;

        this._tituloBase = "Cambiar foto";


    }

    async ngOnInit() {
        //this.obtenerPermisos();
        //this.modelo = this._recursoVisualIn;//await this._usuarioService.buscar(this._sessionHelperService.getSessionUser().idUsuario);
        this._mostrarNueva = false;
        this._textoAgregarImagen = 'Seleccionar imagen'
      
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onOkClick(): void {
        if (this.validarEntradas())
            this.dialogRef.close(this._imagenBase64);
    }

    validarEntradas(): boolean {
        let retorno: boolean = true;

        if (!this._imagenBase64) {
            this.manejoErrorLocal("La imagen es requerida.");
            retorno = false;
        }
        return retorno;
    }

    mostrarErrorImagenes(error) {


        this.manejoErrorLocal("No fue posible procesar la imagen. Error: " + error);
    }

    manejoErrorLocal(mensaje: string) {

        this._mostrarDivError = true;
        this._errorMostrar = mensaje;

        setTimeout(() => {
            this._mostrarDivError = false;
        }, 5000);

    }


    async compress(event: any) {
        if (event.target.files && event.target.files[0]) {

            let fileName: string = event.target.files[0].name;
            var temp = fileName.split(".");
            let extension: string = temp[temp.length - 1];

            extension = extension.toLowerCase();

            if (extension != 'jpg' && extension != 'jpeg' && extension != 'png') {
                this.mostrarErrorImagenes('Extensión no permitida. Solo se permite .jpg, .jpeg y .png.');
                return;
            }

            this.imageSelectedBlog = event.target.files[0];
        }

    }

    imageCropped(event: ImageCroppedEvent) {
        //this.modelo.imagenBase64 = event.base64;
        this._imagenBase64 = event.base64;
        //console.log(event, base64ToFile(event.base64));
    }

    imageLoaded() {
        this.showCropper = true;
        //console.log('Image loaded');
    }

    loadImageFailed() {
        this.mostrarErrorImagenes('Falló la carga de la imagen.');
    }
} 