import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { BotonPanico } from "app/models/businessModels/botonPanico.model";
import { RegistroDiarioEmocion } from "app/models/businessModels/registroDiarioEmocion.model";
import { RegistroDiarioEmocionListarRespuesta } from "app/models/businessModels/transferObjects/registroDiarioEmocionListarRespuesta.model";
import { RegistroDiarioEmocionService } from "app/services/businessService/registroDiarioEmocion.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: 'app-popup-boton-panico-confirmacion-control',
  templateUrl: './popup-boton-panico-confirmacion-control.component.html',
})
export class PopupBotonPanicoConfirmacionControlComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: RegistroDiarioEmocion;
  public modeloBotonPanico: BotonPanico;

  _appConfig: IAppConfig = AppConfig;
  botonPanicoConfirmacionForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    protected _registroDiarioEmocionService: RegistroDiarioEmocionService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistroDiarioEmocion>,
    public _snackBar: MatSnackBar,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.RegistroDiarioEmocion);

    this._recurso = EnumRecursos.RegistroDiarioEmocion;
    this._urlRetorno = '/' + AppConfig.routes.RegistroDiarioEmocion;
    this._tituloBase = 'botón pánico confirmación';

    this._registroDiarioEmocionService.inicializar(RegistroDiarioEmocion, RegistroDiarioEmocionListarRespuesta, "RegistroDiarioEmocion");

    this.modelo = new RegistroDiarioEmocion();
    this.modeloBotonPanico = new BotonPanico();

    this.botonPanicoConfirmacionForm = this.formBuilder.group({
      observacionesSolicitante: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.modeloBotonPanico = this.data.modeloBotonPanico;
  }

  async onSubmit() {
    if (this.botonPanicoConfirmacionForm.valid) {
      Object.assign(this.modeloBotonPanico, this.botonPanicoConfirmacionForm.value);
      try {
        this.blockUI.start()
        let datosRespuesta = await this._registroDiarioEmocionService.registrarBotonPanico(this.modeloBotonPanico);
        if (datosRespuesta) {
          this.mostrarInformacionSnackBar("Muy pronto será contactad@.");
        }
      } catch (error) {
        var detalleError = this.manejoExcepcionPopUp(error);
        this.mostrarErrorSnackBar(detalleError.Mensaje);
      }
      finally {
        this.onClose('Confirmar');
        this.blockUI.stop()
      }
    }
  }

  soloLecturaControles() {
    if (this._soloLectura) {
      this.botonPanicoConfirmacionForm.controls.observacionesSolicitante.disable();
    }
  }

  onClose(accion: string) {
    this.dialogRef.close(accion);
  }
}