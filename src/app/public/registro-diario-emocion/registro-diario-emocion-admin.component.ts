import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../config/app.config';
import { SessionHelperService } from '../../services/helpers/sessionHelper.service';

import { errorMessages, regExps } from '../../Util/Validaciones.service';
import { IAppConfig } from '../../config/iapp.config';
import { RegistroDiarioEmocionService } from "../../services/businessService/registroDiarioEmocion.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseEditPage } from '../../layout/generalPages/BasePages/BaseEditPage';
import { EnumRecursos, EnumTipoConfirm } from '../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../services/generalService/usuarioLogin.service';

import { RegistroDiarioEmocion } from '../../models/businessModels/registroDiarioEmocion.model';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Messages } from 'app/shared/Messages/Messages';
import { RegistroDiarioEmocionListarRespuesta } from 'app/models/businessModels/transferObjects/registroDiarioEmocionListarRespuesta.model';
import { Usuario } from 'app/models/generalModels/usuario.model';
import { UsuarioService } from 'app/services/generalService/usuario.service';
import { NgxCalendarOptions } from 'app/shared/common/commonNgxCalendar';
import { TipoEmocion } from 'app/models/generalModels/tipoEmocion.model';
import { TipoEmocionService } from 'app/services/generalService/tipoEmocion.service';
import { TipoEmocionListarRespuesta } from 'app/models/generalModels/transferObjects/tipoEmocionListarRespuesta.model';
import { MaterialAdicionalCorreoService } from 'app/services/generalService/materialAdicionalCorreo.service';
import { MaterialAdicionalCorreo } from 'app/models/generalModels/materia-adicional-correo.model';
import { MaterialAdicionalCorreoListarRespuesta } from 'app/models/generalModels/transferObjects/materialAdicionalCorreoListarRespuesta.model';
import { FilterItem } from 'app/models/appModels/filterItem.model';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpConfirmData } from 'app/models/appModels/popupConfirm.model';
import { BotonPanico } from 'app/models/businessModels/botonPanico.model';
import { PopupBotonPanicoConfirmacionControlComponent } from './popup-boton-panico-confirmacion-control.component';

@Component({
  selector: 'RegistroDiarioEmocion-admin',
  templateUrl: './registro-diario-emocion-admin.template.html',
  styleUrls: ['./registro-diario-emocion-admin.component.scss'],
  providers: [DatePipe]
})

export class RegistroDiarioEmocionAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: RegistroDiarioEmocion;
  public modeloBotonPanico: BotonPanico;

  public _dataUsuario: Usuario[];
  public _dataTipoEmocion: TipoEmocion[];
  public _dataContenidoAdicional: MaterialAdicionalCorreo[];

  public idTipoEmocion: number;

  public mostrar: boolean = false;
  public existe: boolean = false;
  public creado: boolean = false;
  public showMsg: boolean = false;
  public tokenValido: boolean = false;

  public errorMensaje: string = "";

  public contenidoHTML;
  public token;

  _appConfig: IAppConfig = AppConfig;
  userForm: FormGroup;
  calendarOptions: IAngularMyDpOptions = NgxCalendarOptions;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _registroDiarioEmocionService: RegistroDiarioEmocionService,
    protected _usuarioLoginService: usuarioLoginService,
    protected _materialAdicionalCorreoService: MaterialAdicionalCorreoService,
    private formBuilder: FormBuilder,
    public _datepipe: DatePipe,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
    , protected _usuarioService: UsuarioService
    , protected _tipoEmocionService: TipoEmocionService
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.RegistroDiarioEmocion);

    this.titulo = 'Registro diario de estado emocional';

    this._tituloBase = 'registro diario de la emoción';

    this._registroDiarioEmocionService.inicializar(RegistroDiarioEmocion, RegistroDiarioEmocionListarRespuesta, "RegistroDiarioEmocion");
    this._tipoEmocionService.inicializar(TipoEmocion, TipoEmocionListarRespuesta, "TipoEmocion");
    this._materialAdicionalCorreoService.inicializar(MaterialAdicionalCorreo, MaterialAdicionalCorreoListarRespuesta, "MaterialAdicionalCorreo");
    this.modelo = new RegistroDiarioEmocion();
    this.modeloBotonPanico = new BotonPanico();

    this.userForm = this.formBuilder.group({
      observaciones: ['', [Validators.required]],
    });
  }

  async ngOnInit() {

    try {
      this.blockUI.start();

      var idTipoEmocionTemp: string;
      var token: string;

      this.route.params.forEach((params: Params) => {
        token = params['token'];
        idTipoEmocionTemp = params['idTipoEmocion'];
      });
      this._urlRetorno = '/' + AppConfig.routes.RegistroDiarioEmocion + '/' + token + '/' + idTipoEmocionTemp;

      //Validar el token e iniciar sesión?.
      await this.llenarListas();

      var tokenValido: boolean = await this.validarToken(token, idTipoEmocionTemp);

      if (tokenValido) {
        this.tokenValido = true;

        await this.obtenerPermisos();

        this.modeloBotonPanico.tokenCorreo = token;
        this.parametro = this.modelo.idRegistroDiarioEmocion;

        if (this.modelo.fechaRegistroUsuario) {
          this.existe = true;
          this.userForm.patchValue(this.modelo);
        }
        else {
          this.modelo.idTipoEmocion = this.idTipoEmocion;

          this.modelo = await this._registroDiarioEmocionService.actualizarTipoEmocion(this.modelo);
          this.creado = true;
        }
        this.soloLecturaControles();
        this.mostrar = true;
      }
    }
    catch (e) {
      var detalleError = this.manejoExcepcionPopUp(e);// "Datos inválidos"
      this.errorMensaje = detalleError.Mensaje;
      this.tokenValido = false;

    }
    finally {
      this.blockUI.stop();
    }
  }
  validarObservaciones() {
    if (this.userForm.get('observaciones').value == this.modelo.observaciones) {
      this.mostrarErrorSnackBar("Observaciones sin cambios", 8000)
      return false
    }
    return true;
  }

  async onSubmit() {
    let result: boolean;
    this.marcarControlesParaValidacion(this.userForm);
    if (this.userForm.valid && this.validarObservaciones()) {
      try {
        this.blockUI.start();
        Object.assign(this.modelo, this.userForm.value);
        result = await this._registroDiarioEmocionService.modificar(this.modelo);
        this.mostrarInformacionSnackBar("Registro actualizado", 5000)
      }
      catch (e) {
        this.tokenValido = false;
        var detalleError = this.manejoExcepcionPopUp(e);//"Error al actualizar";
        this.errorMensaje = detalleError.Mensaje;
        this.tokenValido = false;
      }
      finally {
        this.blockUI.stop();
      }
    }
  }
  //#region Métodos

  validarToken = async (token: string, idTipoEmocionTemp: string): Promise<boolean> => {
    var retorno: boolean = true;

    if (idTipoEmocionTemp) {
      this.idTipoEmocion = Number(idTipoEmocionTemp);

      if (isNaN(this.idTipoEmocion)) {
        this.errorMensaje = "Tipo emoción no válida"
        retorno = false;
      }
      else {
        var listTemp = this._dataTipoEmocion.filter(x => x.idTipoEmocion == this.idTipoEmocion);

        if (!listTemp && listTemp.length == 0) {
          this.errorMensaje = "Tipo emoción no existe"
          retorno = false;
        }
      }
    }

    if (token && retorno) {
      try {
        this.modelo = await this._registroDiarioEmocionService.validarTokenRegistro(token);
      }
      catch (error) {
        var detalleError = this.manejoExcepcionPopUp(error);
        this.tokenValido = false;
        this.errorMensaje = detalleError.Mensaje;
        retorno = false;
      }
      return retorno;
    }
  }

  soloLecturaControles() {
    if (this._soloLectura) {
      this.userForm.controls.observaciones.disable();
    }
  }

  async llenarListas() {
    let data;
    data = this.getDefaultParams('Nombre');
    this._dataTipoEmocion = (await this._tipoEmocionService.listar(data)).listTipoEmocionRespuesta;
    data.Orden.campoOrden = 'fecha';

    data.Filtros = [];
    let fecha = this._datepipe.transform(new Date(), this._sessionHelperService.FormatoFechaCanonica); //formatDate();
    data.Filtros.push(new FilterItem('', 'fecha', '=', fecha));

    this._dataContenidoAdicional = (await this._materialAdicionalCorreoService.listar(data)).listMaterialAdicionalCorreoRespuesta;

    if (this._dataContenidoAdicional && this._dataContenidoAdicional.length > 0)
      this.contenidoHTML = this._dataContenidoAdicional[0].contenidoHTML;
  }

  async abrirPopupSolicitudAlertaPanico() {
    let dialogRef
    if (this.dialog) {
      dialogRef = this.dialog.open(PopupBotonPanicoConfirmacionControlComponent, {
        width: "500px",
        disableClose: false,
        data: {
          modeloBotonPanico: this.modeloBotonPanico,
        }
      });
    }
  }
}


