
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';

import { errorMessages, regExps } from '../../../Util/Validaciones.service';
import { IAppConfig } from '../../../config/iapp.config';
import { BotonPanicoService } from "../../../services/businessService/botonPanico.service";
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { BaseEditPage } from '../../generalPages/BasePages/BaseEditPage';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';

import { BotonPanico } from '../../../models/businessModels/botonPanico.model';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Messages } from 'app/shared/Messages/Messages';
import { BotonPanicoListarRespuesta } from 'app/models/businessModels/transferObjects/botonPanicoListarRespuesta.model';
import { Usuario } from 'app/models/generalModels/usuario.model';
import { UsuarioService } from 'app/services/generalService/usuario.service';
import { NgxCalendarOptions } from 'app/shared/common/commonNgxCalendar';
import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { MyDatePicker } from 'app/models/appModels/myDatePicker.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'BotonPanico-admin',
  templateUrl: './boton-panico-admin.template.html',
})

export class BotonPanicoAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: BotonPanico;

  public _dataUsuario: Usuario[];

  _appConfig: IAppConfig = AppConfig;
  userForm: FormGroup;
  calendarOptions: IAngularMyDpOptions = NgxCalendarOptions;

  errors = errorMessages;

  public linkWhatsapp: string='';

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _botonPanicoService: BotonPanicoService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
    , protected _usuarioService: UsuarioService

  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.BotonPanico);
    this.calendarOptions.firstDayOfWeek = "mo";
    this._urlRetorno = '/' + AppConfig.routes.BotonPanico;
    this._tituloBase = 'alerta de pánico';

    this._botonPanicoService.inicializar(BotonPanico, BotonPanicoListarRespuesta, "BotonPanico");
    this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");
    this.modelo = new BotonPanico();

    this.userForm = this.formBuilder.group({
      idUsuario: ['', [Validators.required]],
      fechaCreacionView: ['', [Validators.required]],
      fechaAtencionView: ['', [Validators.required]],
      observacionesAtencion: ['', [Validators.required]],
      observacionesSolicitante: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  async ngOnInit() {

    await this.obtenerPermisos();
    this.blockUI.start();

    let id: string;
    this.route.params.forEach((params: Params) => {
      id = params['id'];
    });

    try {
      this.parametro = this.prepararIdNumero(id, this._urlRetorno);
      if (this.parametro != 0) {

        this.modelo = await this._botonPanicoService.buscar(this.parametro);

        if (!this.modelo.idUsuarioAtiende)
          this.modelo.idUsuarioAtiende = this.modelo.usuarioIdEncargadoSaludEmocional;

        this.userForm.patchValue(this.modelo);

        this.linkWhatsapp= "https://api.whatsapp.com/send?phone=+57"+ this.modelo.celular +"&text=Hola%20vengo%20ayudarte"

        this.soloLecturaControles();
      }
      await this.llenarListas();
    }
    catch (e) {
      this.manejoExcepcion(e, this._urlRetorno);
    }
    finally {
      this.blockUI.stop();
    }
  }

  async onSubmit() {
    let result: boolean;
    this.marcarControlesParaValidacion(this.userForm);
    if (this.userForm.valid) {
      if (this.fechasValidas()) {
        this.modelo.fechaAtencion = new Date(this.userForm.controls.fechaAtencionView.value.singleDate.jsDate);
        try {
          this.blockUI.start();
          Object.assign(this.modelo, this.userForm.value);
          result = await this._botonPanicoService.modificar(this.modelo);

          this.router.navigate([this._urlRetorno]);
        }
        catch (e) {
          this.manejoExcepcion(e);
        }
        finally {
          this.blockUI.stop();
        }
      }
      else {
        this.mostrarErrorSnackBar("La fecha de atención debe ser mayor o igual a la fecha de creación y menor o igual la fehca de hoy", 8000)
      }
    }
  }

  async onDelete() {
    let result: boolean;

    if (!confirm(Messages.val.Eliminar)) {
      return;
    }

    try {
      this.blockUI.start();
      result = await this._botonPanicoService.eliminar(this.parametro);
      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  //#region Métodos
  soloLecturaControles() {
    this.userForm.controls.fechaCreacionView.disable();
    this.userForm.controls.idUsuario.disable();
    if (this._soloLectura) {
      this.userForm.controls.idUsuario.disable();
      this.userForm.controls.fechaCreacionView.disable();
      this.userForm.controls.fechaAtencionView.disable();
      this.userForm.controls.observacionesAtencion.disable();
    }
  }

  async llenarListas() {
    let data;
    data = this.getDefaultParams('nombre');
    this._dataUsuario = (await this._usuarioService.listar(data)).listUsuarioRespuesta;
  }

  fechasValidas() {
    let fechaCreacion = new Date(this.userForm.controls.fechaCreacionView.value.singleDate.jsDate);
    let fechaAtencion = new Date(this.userForm.controls.fechaAtencionView.value.singleDate.jsDate);
    fechaAtencion.setHours(0, 0, 0, 0);
    fechaCreacion.setHours(0, 0, 0, 0);
    if (fechaAtencion.getTime() >= fechaCreacion.getTime() && fechaAtencion.getTime() <= (new Date()).getTime()) {
      return true;
    }
    return false;
  }
  //#endregion
}