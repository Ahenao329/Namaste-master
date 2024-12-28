import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "../../../config/app.config";
import { IAppConfig } from "../../../config/iapp.config";
import { SessionHelperService } from "../../../services/helpers/sessionHelper.service";
import { usuarioLoginService } from "../../../services/generalService/usuarioLogin.service";
import { MatDialog } from '@angular/material/dialog';
import { PopupSeleccionarImagenComponent } from '../../businessControls/popup-seleccionar-imagen/popup-seleccionar-imagen.component';

@Component({
    selector: "app-seleccionar-imagen-control",
    templateUrl: "./seleccionar-imagen-control.template.html",
    styleUrls: ["./seleccionar-imagen-control.component.scss"]
})
export class SeleccionarImagenControlComponent implements OnInit {

    public rutaImagenIn: string;
    @Input()
    set rutaImagen(rutaImagen: string) {
       this.recargarImagen(rutaImagen);
    }

    @Input("soloLectura") soloLectura: boolean;

    @Output() onImagenSeleccionada = new EventEmitter<string>();

    _imagenBase64: string;

    _appConfig: IAppConfig = AppConfig;

    public _rutaImagenMostrar: string = AppConfig.constantes.rutaImagen_cargarImagen;

    constructor(
        public router: Router,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService
        , public dialog: MatDialog,
    ) {

    }

    async ngOnInit() {
    }
   
    async onAgregarImagen() {
        let dialogRef;

        if (this.soloLectura)
            return;

        dialogRef = this.dialog.open(PopupSeleccionarImagenComponent, {
            width: '900px',
            disableClose: true
        });

        await dialogRef.afterClosed().toPromise().then((res: string) => {
            if (res) {
                this._imagenBase64 = res;
                this._rutaImagenMostrar = this._imagenBase64;

                this.onImagenSeleccionada.emit(this._imagenBase64);
            }
        });
    }

    //métodos
    public recargarImagen(rutaImagen: string)
    {
        if (rutaImagen && rutaImagen.length > 0) {
            this.rutaImagenIn = rutaImagen;
            this._rutaImagenMostrar = this.rutaImagenIn;
        }
        else {
            this._rutaImagenMostrar = AppConfig.constantes.rutaImagen_cargarImagen;
        }
    }
}
