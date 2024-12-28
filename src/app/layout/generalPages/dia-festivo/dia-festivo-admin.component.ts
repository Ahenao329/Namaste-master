import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IAngularMyDpOptions } from "angular-mydatepicker";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { MyDatePicker } from "app/models/appModels/myDatePicker.model";
import { DiaFestivo } from "app/models/generalModels/dia-festivo.model";
import { DiaFestivoListarRespuesta } from "app/models/generalModels/transferObjects/diaFestivoListarRespuesta.model";
import { DiaFestivoService } from "app/services/generalService/diaFestivo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { NgxCalendarOptions } from "app/shared/common/commonNgxCalendar";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../BasePages/BaseEditPage";

@Component({
  selector: 'dia-festivo-admin',
  templateUrl: './dia-festivo-admin.component.html',
})

export class DiaFestivoAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: DiaFestivo;

  _appConfig: IAppConfig = AppConfig;

  diaFestivoForm: FormGroup;
  calendarOptions: IAngularMyDpOptions = NgxCalendarOptions;
  errors = errorMessages;
  _dataDiasFestivos: any;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _diaFestivoService: DiaFestivoService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.DiaFestivo);

    this._recurso = EnumRecursos.DiaFestivo;
    this._urlRetorno = '/' + AppConfig.routes.DiaFestivo;
    this._tituloBase = 'día festivo';

    this._diaFestivoService.inicializar(DiaFestivo, DiaFestivoListarRespuesta, "DiaFestivo");

    this.modelo = new DiaFestivo();

    this.diaFestivoForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      fechaView: ['', [Validators.required]],
    });

  }
  crearObjetoDataDisabled() {
    var kvArray = this._dataDiasFestivos;
    var reformattedArray = kvArray.map(function (obj) {
      var rObj = {};
      let fecha = new Date(obj.fecha)
      rObj['year'] = fecha.getFullYear();
      rObj['month'] = fecha.getMonth() + 1;
      rObj['day'] = fecha.getDate();
      return rObj;
    });
    this.calendarOptions.disableDates = reformattedArray;
    this.calendarOptions.firstDayOfWeek = "mo";
    this.calendarOptions.disableWeekends = true;
  }

  async ngOnInit() {
    await this.obtenerPermisos();
    this.blockUI.start();
    let id: string;
    this.route.params.forEach((params: Params) => {
      id = params['id'];
    });

    try {
      await this.llenarListas();
      this.crearObjetoDataDisabled();

      this.parametro = this.prepararIdNumero(id, this._urlRetorno);
      if (this.parametro != 0) {
        this._soloLectura = true;
        this.modelo = await this._diaFestivoService.buscar(this.parametro);
        this.diaFestivoForm.controls['fechaView'].setValue(new MyDatePicker(new Date(this.modelo.fecha)))

        this.soloLecturaControles();
      }
    }
    catch (e) {
      this.manejoExcepcion(e, this._urlRetorno);
    }
    finally {
      this.blockUI.stop();
    }
  }

  async onSubmit() {
    this.marcarControlesParaValidacion(this.diaFestivoForm);

    this.diaFestivoForm.controls['fecha'].setValue(this.diaFestivoForm.get('fechaView').value.singleDate.jsDate);

    Object.assign(this.modelo, this.diaFestivoForm.value);
    if (this.diaFestivoForm.valid) {
      try {
        this.blockUI.start();
        if (this.parametro == 0)
          this.modelo = await this._diaFestivoService.crear(this.modelo);
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

      await this._diaFestivoService.eliminar(this.parametro);

      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  soloLecturaControles() {
    if (this._soloLectura) {
      this.diaFestivoForm.controls.fecha.disable();
    }
  }
  
  async llenarListas() {
    let data = this.getDefaultParams('fecha');
    data.Filtros = [];
    this._dataDiasFestivos = (await this._diaFestivoService.listar(data)).listDiaFestivoRespuesta;
  }
}