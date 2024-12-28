import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { IMyDate } from "angular-mydatepicker";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { MyDatePicker } from "app/models/appModels/myDatePicker.model";
import { DiaFestivo } from "app/models/generalModels/dia-festivo.model";
import { MaterialAdicionalCorreo } from "app/models/generalModels/materia-adicional-correo.model";
import { DiaFestivoListarRespuesta } from "app/models/generalModels/transferObjects/diaFestivoListarRespuesta.model";
import { MaterialAdicionalCorreoListarRespuesta } from "app/models/generalModels/transferObjects/materialAdicionalCorreoListarRespuesta.model";
import { DiaFestivoService } from "app/services/generalService/diaFestivo.service";
import { MaterialAdicionalCorreoService } from "app/services/generalService/materialAdicionalCorreo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { FunctionsHelperService } from "app/services/helpers/functionsHelper.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { NgxCalendarOptions } from "app/shared/common/commonNgxCalendar";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../BasePages/BaseEditPage";

@Component({
    selector: 'material-adicional-correo-admin',
    templateUrl: './material-adicional-correo-admin.component.html',
})

export class MaterialAdicionalCorreoAdminComponent extends BaseEditPage implements OnInit {
    public id: number = 0;
    public modelo: MaterialAdicionalCorreo;
    editorConfig: AngularEditorConfig;
    _appConfig: IAppConfig = AppConfig;
    _dataDiasFestivos: any;

    materialAdicionalCorreoForm: FormGroup;
    calendarOptions = NgxCalendarOptions;
    errors = errorMessages;

    @BlockUI() blockUI: NgBlockUI;

    constructor(private route: ActivatedRoute,
        private router: Router,
        protected _sessionHelperService: SessionHelperService,
        protected _materialAdicionalCorreoService: MaterialAdicionalCorreoService,
        protected _usuarioLoginService: usuarioLoginService,
        protected _diaFestivoService: DiaFestivoService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        protected _functionHelper: FunctionsHelperService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.MaterialAdicionalCorreo);

        this._recurso = EnumRecursos.DiaFestivo;
        this._urlRetorno = '/' + AppConfig.routes.MaterialAdicionalCorreo;
        this._tituloBase = 'material adicional correo';

        this._materialAdicionalCorreoService.inicializar(MaterialAdicionalCorreo, MaterialAdicionalCorreoListarRespuesta, "MaterialAdicionalCorreo");
        this._diaFestivoService.inicializar(DiaFestivo, DiaFestivoListarRespuesta, 'DiaFestivo');
        this.modelo = new MaterialAdicionalCorreo();

        this.editorConfig = this._functionHelper.getEditorDefaultConfig();
        this.materialAdicionalCorreoForm = this.formBuilder.group({
            fecha: ['', [Validators.required]],
            fechaView: ['', [Validators.required]],
            contenidoHTML: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(100000)])],
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
        try {
            this.blockUI.start();
            await this.obtenerPermisos();

            await this.llenarListas();
            this.crearObjetoDataDisabled();

            let id: string;
            this.route.params.forEach((params: Params) => {
                id = params['id'];

            });
            this.parametro = this.prepararIdNumero(id, this._urlRetorno);
            if (this.parametro != 0) {
                this.modelo = await this._materialAdicionalCorreoService.buscar(this.parametro);
                this.materialAdicionalCorreoForm.patchValue(this.modelo);
                this.materialAdicionalCorreoForm.controls['fechaView'].setValue(new MyDatePicker(new Date(this.modelo.fecha)));
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
    public errorsLocal = {
        maxLength100000: 'El campo debe tener máximo 100.000 caracteres.'
    };

    async onSubmit() {
        let resultado: boolean;
        this.marcarControlesParaValidacion(this.materialAdicionalCorreoForm);
        if (this.materialAdicionalCorreoForm.get('fechaView').value) {
            this.materialAdicionalCorreoForm.controls['fecha'].setValue(this.materialAdicionalCorreoForm.get('fechaView').value.singleDate.jsDate);
        }

        Object.assign(this.modelo, this.materialAdicionalCorreoForm.value);
        if (this.materialAdicionalCorreoForm.valid) {
            try {
                this.blockUI.start();
                if (this.parametro == 0) {
                    this.modelo = await this._materialAdicionalCorreoService.crear(this.modelo);
                } else {
                    resultado = await this._materialAdicionalCorreoService.modificar(this.modelo);
                }
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

            await this._materialAdicionalCorreoService.eliminar(this.parametro);

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
            this.materialAdicionalCorreoForm.controls.fecha.disable();
            this.materialAdicionalCorreoForm.controls.contenidoHTML.disable();

        }
    }

    async llenarListas() {
        let data = this.getDefaultParams('fecha');
        data.Filtros = [];
        this._dataDiasFestivos = (await this._diaFestivoService.listar(data)).listDiaFestivoRespuesta;
    }
}