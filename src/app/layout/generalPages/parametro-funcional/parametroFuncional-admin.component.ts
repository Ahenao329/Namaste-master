
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';

import { errorMessages, regExps } from '../../../Util/Validaciones.service';
import { IAppConfig } from '../../../config/iapp.config';
import { ParametroFuncionalService } from "../../../services/generalService/parametroFuncional.service";
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { BaseEditPage } from '../BasePages/BaseEditPage';
import { EnumRecursos, EnumParametros } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';

import { ParametroFuncional } from '../../../models/generalModels/parametroFuncional.model';
import { ParametroFuncionalListarRespuesta } from 'app/models/generalModels/transferObjects/parametroFuncionalListarRespuesta.model';


@Component({
  selector: 'ParametroFuncional-admin',
  templateUrl: './parametroFuncional-admin.component.html',
  //providers: [ParametroFuncionalService]
})

export class ParametroFuncionalAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: ParametroFuncional;

  _appConfig: IAppConfig = AppConfig;
  userForm: FormGroup;

  _mostrarDivError: boolean = false;
  _erroresValidacion: string = '';

  _mostrarInput: boolean = true;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _parametroFuncionalService: ParametroFuncionalService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog


  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ParametroFuncional);

    this._recurso = EnumRecursos.ParametroFuncional;
    this._urlRetorno = '/ParametrosFuncionales';
    this._tituloBase = 'parámetro funcional';

    this.modelo = new ParametroFuncional();

    this._parametroFuncionalService.inicializar(ParametroFuncional, ParametroFuncionalListarRespuesta, "ParametroFuncional");

    this.userForm = this.formBuilder.group({
      idParametroFuncional: ['', Validators.compose([
        Validators.required,
        Validators.pattern(regExps.number)])],
      nombre: ['', [Validators.required]],
      valor: ['', [Validators.required]],

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
        this.modelo = await this._parametroFuncionalService.buscar(this.parametro);

        this.userForm.patchValue(this.modelo);

        this._mostrarInput = true;

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

    Object.assign(this.modelo, this.userForm.value);

    if (this.userForm.valid && this.validarEntradas()) {

      try {
        this.blockUI.start();

        if (this.parametro != 0)
          result = await this._parametroFuncionalService.modificar(this.modelo);

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
  validarEntradas(): boolean {
    let retorno: boolean = true;
    let mensajeError: string = '';

    this._erroresValidacion = '';
    this._mostrarDivError = false;

    /*RegistrosPorPagina = 1,
      MaximoImagenesProducto = 100,
      MinutosRefrescamientoTablero = 101,
      MinutosRefrescamientoAvanceProcedimientos = 102,
*/

    let valor: number;

    if (this.modelo.valor.trim().length == 0)
      mensajeError = 'El valor es requerido.';
    else if (this.modelo.valor.indexOf(',') >= 0 || this.modelo.valor.indexOf('.') >= 0)
      mensajeError = 'El valor debe ser un número entero.';
    else {
      valor = Number.parseInt(this.modelo.valor);

      if (isNaN(valor))
        mensajeError = 'El valor debe ser un número entero.';
      else {
        if (valor < 0)
          mensajeError = 'El valor debe ser menor mayor o igual cero.';
        else
          this.modelo.valor = valor.toString();
      }
    }

    if (mensajeError != '') {
      this._erroresValidacion = mensajeError;
      this._mostrarDivError = true;
      return false;
    }

    /*switch (this.parametro) {
      case EnumParametros.MaximoImagenesProducto:
        if (valor > 10 || valor < 0)
          mensajeError = 'El valor debe estar entre 0 y 10.';
        break;
     
      default:
        break;
        
    }*/

    if (mensajeError != '') {
      this._erroresValidacion = mensajeError;
      this._mostrarDivError = true;
      retorno = false;
    }


    return retorno;
  }

  //#region Métodos
  soloLecturaControles() {
    if (this._soloLectura) {
      this.userForm.controls.valor.disable();
    }
  }

  async llenarListas() {
    let data;

  }

  //#endregion
}