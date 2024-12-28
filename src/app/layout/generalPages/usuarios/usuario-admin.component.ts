
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';

import { errorMessages, regExps } from '../../../Util/Validaciones.service';
import { IAppConfig } from '../../../config/iapp.config';
import { UsuarioService } from "../../../services/generalService/usuario.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseEditPage } from '../BasePages/BaseEditPage'
import { EnumRecursos, EnumPerfiles } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';

import { Usuario } from '../../../models/generalModels/usuario.model';
import { PerfilesService } from '../../../services/generalService/perfiles.service';
import { Perfiles } from '../../../models/generalModels/perfiles.model';

import { PerfilesListarRespuesta } from '../../../models/generalModels/transferObjects/perfilesListarRespuesta.model';
import { EnumTipoAlerta } from '../../generalControls/PopUpAlert/popUpAlert.component';
import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { Messages } from 'app/shared/Messages/Messages';
import { Cargo } from 'app/models/generalModels/cargo.model';
import { Area } from 'app/models/generalModels/area.model';
import { CargoService } from 'app/services/generalService/cargo.service';
import { AreaService } from 'app/services/generalService/area.service';
import { CargoListarRespuesta } from 'app/models/generalModels/transferObjects/cargoListarRespuesta.model';
import { AreaListarRespuesta } from 'app/models/generalModels/transferObjects/areaListarRespuesta.model';
import { FilterItem } from 'app/models/appModels/filterItem.model';
import { SiNo } from 'app/models/generalModels/siNo.model';
import { SinoService } from 'app/services/generalService/siNo.service';
import { SiNoListarRespuesta } from 'app/models/generalModels/transferObjects/siNoListarRespuesta';

@Component({
  selector: 'Usuario-admin',
  templateUrl: './usuario-admin.component.html',
})

export class UsuarioAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: Usuario;

  public _dataPerfiles: Perfiles[];
  public _dataUsuariosEncargadoSaludEmocional: Usuario[];
  public _dataUsuariosLider: Usuario[]
  public _dataCargos: Cargo[];
  public _dataAreas: Area[];
  public _dataSiNo: SiNo[];

  idRegistroDocente: number;

  _mostrarReenviarCorreoInicio: boolean = false;

  _appConfig: IAppConfig = AppConfig;
  userForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioService: UsuarioService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    protected _perfilesService: PerfilesService,
    protected _cargosService: CargoService,
    protected _areasService: AreaService,
    protected _siNoService: SinoService

  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);

    this._recurso = EnumRecursos.Usuario;
    this._urlRetorno = '/' + AppConfig.routes.Usuarios;
    this._tituloBase = 'usuario';

    this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");
    this._perfilesService.inicializar(Perfiles, PerfilesListarRespuesta, "Perfil");
    this._cargosService.inicializar(Cargo, CargoListarRespuesta, 'Cargo');
    this._areasService.inicializar(Area, AreaListarRespuesta, 'Area');
    this._siNoService.inicializar(SiNo, SiNoListarRespuesta, 'SiNo');

    this.modelo = new Usuario();

    this.userForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', Validators.compose([
                  Validators.required,
                  Validators.pattern(regExps.email)])],
      idPerfil: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      idLider: ['', [Validators.required]],
      idEncargadoSaludEmocional: ['', [Validators.required]],
      idCargo: ['', [Validators.required]],
      idArea: ['', [Validators.required]],
      reportaEmociones: [undefined, [Validators.required]],
      conCorreoDiario: [undefined, [Validators.required]],
      celular: ['', [Validators.required]],

    });
  }

  async ngOnInit() {
    await this.obtenerPermisos();
    this.blockUI.start();

    let id: string;
    this.route.params.forEach((params: Params) => {
      id = params['id'];

      if (Number(params['id1']) != NaN)
        this.idRegistroDocente = Number(params['id1']);
    });

    try {
      this.parametro = this.prepararIdNumero(id, this._urlRetorno);
      if (this.parametro != 0) {
        this.modelo = await this._usuarioService.buscar(this.parametro);

        this.userForm.patchValue(this.modelo);

        if (this.modelo.activo != null && this.modelo.activo)
          this.userForm.controls.activo.setValue(true);
        else if (this.modelo.activo != null)
          this.userForm.controls.activo.setValue(false);

        if (this._puedeModificar && !this.modelo.establecioContrasena)
          this._mostrarReenviarCorreoInicio = true;

        this.onPerfilSelectedChanged();

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
    let resultado: boolean;
    this.marcarControlesParaValidacion(this.userForm);
    Object.assign(this.modelo, this.userForm.value);
    if (this.userForm.valid && this.ValidacionesSegunPerfil()) {
      try {
        this.blockUI.start();

        this.modelo.activo = this.userForm.controls.activo.value;

        if (this.parametro == 0)
          this.modelo = await this._usuarioService.crear(this.modelo);
        else
          resultado = await this._usuarioService.modificar(this.modelo);

        this.router.navigate([this._urlRetorno]);
      }
      catch (e) {
        this.manejoExcepcion(e);
      }
      finally {
        this.blockUI.stop();
      }
    }
  }

  async onDelete() {

    if (!confirm(Messages.val.Eliminar)) {
      return;
    }

    try {
      this.blockUI.start();

      await this._usuarioService.eliminar(this.parametro);

      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  async onReenviarCorreo() {

    try {
      this.blockUI.start();

      await this._usuarioService.reenviarCorreoInicio(this.parametro);

      this._TipoAlert = EnumTipoAlerta.Confirmacion;
      this._TituloPopup = "Confirmación";
      this._DescripcionPopup = "El correo fue enviado correctamente.";
      this._RutaPopUpAlert = this._appConfig.routes.UsuariosAdmin + "/" + this.parametro.toString();
      this.openDialog();
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  async onPerfilSelectedChanged() {

  }

  //#region Métodos

  soloLecturaControles() {
    if (this._soloLectura) {
      this.userForm.controls.nombre.disable();
      this.userForm.controls.email.disable();
      this.userForm.controls.idPerfil.disable();
      this.userForm.controls.activo.disable();
      this.userForm.controls.idLider.disable();
      this.userForm.controls.idEncargadoSaludEmocional.disable();
      this.userForm.controls.idCargo.disable();
      this.userForm.controls.idArea.disable();
      this.userForm.controls.reportaEmociones.disable();
      this.userForm.controls.conCorreoDiario.disable();
      this.userForm.controls.celular.disable();
    }
  }

  async llenarListas() {
    let data = this.getDefaultParams('nombre');

    this._dataPerfiles = (await this._perfilesService.listar(data)).listPerfilesRespuesta;
    this._dataCargos = (await this._cargosService.listar(data)).listCargoRespuesta;
    this._dataAreas = (await this._areasService.listar(data)).listAreaRespuesta;
    data.Filtros = [];
    this._dataSiNo = (await this._siNoService.listar(data)).listSiNoRespuesta;
    this.llenarUsuariosLider();
    this.llenarUsuariosEncargadoSaludEmocional();
  }

  async llenarUsuariosLider() {
    let data = this.getDefaultParams('nombre');
    data.Filtros.push(new FilterItem('AND', 'IdPerfil', '=', EnumPerfiles.LiderEquipo.toString()));
    this._dataUsuariosLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;
  }

  async llenarUsuariosEncargadoSaludEmocional() {
    let data = this.getDefaultParams('nombre');
    data.Filtros.push(new FilterItem('AND', 'IdPerfil', '=', EnumPerfiles.ResponsableSaludEmocional.toString()));
    this._dataUsuariosEncargadoSaludEmocional = (await this._usuarioService.listar(data)).listUsuarioRespuesta;
  }
  //#endregion

  ValidacionesSegunPerfil(): boolean {
    let valido: boolean = true;
    let mensaje: string = '';

    if (mensaje.length > 0) {
      valido = false;
      this.lanzarAlertaError(mensaje);
    }
    return valido;
  }

  lanzarAlertaError(mensaje: string) {
    this._TituloPopup = 'Advertencia';
    this._TipoAlert = EnumTipoAlerta.Error;
    this._DescripcionPopup = mensaje;
    this.openDialog();
  }
}