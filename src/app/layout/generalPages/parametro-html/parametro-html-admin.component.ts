
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';

import { errorMessages, regExps } from '../../../Util/Validaciones.service';
import { IAppConfig } from '../../../config/iapp.config';
import { ParametroHTMLService } from "../../../services/generalService/parametroHTML.service";
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { BaseEditPage } from '../../generalPages/BasePages/BaseEditPage';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';

import { ParametroHTML } from '../../../models/generalModels/parametroHTML.model';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Messages } from 'app/shared/Messages/Messages';
import { NgxCalendarOptions } from 'app/shared/common/commonNgxCalendar';
import { ParametroHTMLListarRespuesta } from 'app/models/generalModels/transferObjects/parametroHTMLListarRespuesta.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FunctionsHelperService } from 'app/services/helpers/functionsHelper.service';

@Component({
  selector: 'ParametroHTML-admin',
  templateUrl: './parametro-html-admin.template.html',
})

export class ParametroHTMLAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: ParametroHTML;

  _appConfig: IAppConfig = AppConfig;
  userForm: FormGroup;
  calendarOptions: IAngularMyDpOptions = NgxCalendarOptions;

  errors = errorMessages;

  public errorsLocal = {
    maxLength8000: 'El campo debe tener máximo 8.000 caracteres.'
  };

  editorConfig: AngularEditorConfig;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _parametroHTMLService: ParametroHTMLService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
    , protected _functionHelper: FunctionsHelperService

  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ParametroHTML);

    this._urlRetorno = '/' + AppConfig.routes.ParametrosHTML;
    this._tituloBase = 'parámetro HTML';

    this._parametroHTMLService.inicializar(ParametroHTML, ParametroHTMLListarRespuesta, "ParametroHTML");

    this.modelo = new ParametroHTML();

    this.editorConfig = this._functionHelper.getEditorDefaultConfig();

    this.userForm = this.formBuilder.group({
      idParametroHTML: ['',[]],
      nombre: ['', [Validators.required]],
      valor: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(8000)])],
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
        this.modelo = await this._parametroHTMLService.buscar(this.parametro);

        this.userForm.patchValue(this.modelo);

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
      try {
        this.blockUI.start();

        Object.assign(this.modelo, this.userForm.value);

        if (this.parametro == 0)
          this.modelo = await this._parametroHTMLService.crear(this.modelo);
        else
          result = await this._parametroHTMLService.modificar(this.modelo);

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

  /*async onDelete() {
    let result: boolean;

    if (!confirm(Messages.val.Eliminar)) {
      return;
    }

    try {
      this.blockUI.start();
      result = await this._parametroHTMLService.eliminar(this.parametro);
      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }*/

  //#region Métodos
  soloLecturaControles() {
    if (this._soloLectura) {
      this.userForm.controls.idParametroHTML.disable();
      this.userForm.controls.nombre.disable();
      this.userForm.controls.valor.disable();

    }
  }

  async llenarListas() {
    let data;

  }

  //#endregion
}