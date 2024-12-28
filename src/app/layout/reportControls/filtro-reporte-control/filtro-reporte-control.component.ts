import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { IAngularMyDpOptions } from "angular-mydatepicker";
import { AppConfig } from "app/config/app.config";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { FilterItem } from "app/models/appModels/filterItem.model";
import { MyDatePicker } from "app/models/appModels/myDatePicker.model";
import { Area } from "app/models/generalModels/area.model";
import { Cargo } from "app/models/generalModels/cargo.model";
import { DiaFestivo } from "app/models/generalModels/dia-festivo.model";
import { ReportePeticion } from "app/models/generalModels/reportePeticion.model";
import { ReporteRespuesta } from "app/models/generalModels/reporteRespuesta.model";
import { AreaListarRespuesta } from "app/models/generalModels/transferObjects/areaListarRespuesta.model";
import { CargoListarRespuesta } from "app/models/generalModels/transferObjects/cargoListarRespuesta.model";
import { DiaFestivoListarRespuesta } from "app/models/generalModels/transferObjects/diaFestivoListarRespuesta.model";
import { ReporteListarRespuesta } from "app/models/generalModels/transferObjects/reporteListarRespuesta.model";
import { UsuarioListarRespuesta } from "app/models/generalModels/transferObjects/usuarioListarRespuesta.model";
import { Usuario } from "app/models/generalModels/usuario.model";
import { routerTransition } from "app/router.animations";
import { ReporteGeneralService } from "app/services/businessService/reporteGeneral.service";
import { AreaService } from "app/services/generalService/area.service";
import { CargoService } from "app/services/generalService/cargo.service";
import { DiaFestivoService } from "app/services/generalService/diaFestivo.service";
import { UsuarioService } from "app/services/generalService/usuario.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { NgxCalendarOptions } from "app/shared/common/commonNgxCalendar";
import { EnumPerfiles, EnumRecursos } from "app/shared/enums/commonEnums";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
    selector: 'app-filtro-reporte-control',
    templateUrl: './filtro-reporte-control.component.html',
    animations: [routerTransition()]
})

export class FiltroReporteControl extends BaseEditPage implements OnInit {
    public mostrarFiltros: boolean = false;
    public idPerfilSesion: number;
    public _dataUsuariosLider: Usuario[];
    public todosUsuarioLider: Usuario;
    public todosCargos: Cargo;
    public todosAreas: Area;
    public modelo: ReportePeticion;
    public _dataUsuariosByLider: Usuario[];
    public _dataDiasFestivos: any;
    public _dataCargos: Cargo[];
    public _dataAreas: Area[];

    reportForm: FormGroup;

    public modeloSemana: any;

    calendarOptions = NgxCalendarOptions;

    public datosRespuesta: ReporteRespuesta;

    @Output() enviarModelo = new EventEmitter<ReportePeticion>();
    @Output() mostrarGrafica = new EventEmitter<boolean>();

    errors = errorMessages;

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _router: Router,
        private _adminService: ReporteGeneralService,
        protected _usuarioService: UsuarioService,
        protected _cargosService: CargoService,
        protected _areasService: AreaService,
        protected _diaFestivoService: DiaFestivoService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
        private formBuilder: FormBuilder,
        public _snackBar: MatSnackBar,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ReporteDistribucion);

        this.titulo = 'filtros';
        this.modelo = new ReportePeticion();
        this.datosRespuesta = new ReporteRespuesta()

        this._adminService.inicializar(ReportePeticion, ReporteListarRespuesta, "RegistroDiarioEmocion");
        this._usuarioService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");
        this._diaFestivoService.inicializar(DiaFestivo, DiaFestivoListarRespuesta, "DiaFestivo");
        this._cargosService.inicializar(Cargo, CargoListarRespuesta, 'Cargo');
        this._areasService.inicializar(Area, AreaListarRespuesta, 'Area');

        this.reportForm = this.formBuilder.group({
            fechaInicialView: [undefined, [Validators.required]],
            fechaFinalView: [undefined, [Validators.required]],
            idUsuarioLider: [undefined, [Validators.required]],
            idUsuario: [undefined, [Validators.required]],
            idCargo: [undefined, [Validators.required]],
            idArea: [undefined, [Validators.required]],
        });
    }

    async ngOnInit() {
        await this.obtenerPermisos();
        try {
            this.blockUI.start();

            this.configuracionParaIniciar();

            this.idPerfilSesion = this._sessionHelperService.getSessionUser().idPerfil;
            this.calendarOptions.firstDayOfWeek = "mo";
            this.calendarOptions.disableWeekends = false;

            this.llenarListas();
        }
        catch (e) {
            this.manejoExcepcion(e, '/' + AppConfig.routes.dashboard);
        }
        finally {
            this.blockUI.stop();
        }
    }

    onSubmit() {
        if (this.reportForm.valid) {
            if (!this.fechasInvalidas()) {
                this.llenarModeloPeticion();
            } else {
                this.mostrarErrorSnackBar("La fecha inicial debe ser menor o igual a la fecha final", 8000)
            }
        }
    }

    async onLlenarUsuariosByLider(idLider: number) {
        this.onChanged();
        let data = this.getDefaultParams('nombre');

        data.Filtros.push(new FilterItem('AND', 'IdUsuario', '>', '1'));

        if (idLider != 0)
            data.Filtros.push(new FilterItem('AND', 'IdLider', '=', idLider.toString()));

        if (this.idPerfilSesion == EnumPerfiles.ResponsableSaludEmocional)  //Asi filtre por líder, solo puede ver los que tiene asignados.
            data.Filtros.push(new FilterItem('AND', 'IdEncargadoSaludEmocional', '=', this._sessionHelperService.getSessionUser().idUsuario.toString()));

        this._dataUsuariosByLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;

        this._dataUsuariosByLider.unshift(this.todosUsuarioLider);
    }

    onChanged() {
        this.mostrarGrafica.emit(false);
    }

    //Región métodos

    enviarModeloGrafica() {
        this.mostrarFiltros = true;
        if (!this.fechasInvalidas()) {
            this.llenarModeloPeticion();
        }
    }

    llenarModeloPeticion() {
        this.modelo.fechaInicial = new Date(this.reportForm.controls.fechaInicialView.value.singleDate.jsDate);
        this.modelo.fechaFinal = new Date(this.reportForm.controls.fechaFinalView.value.singleDate.jsDate);
        this.modelo.idUsuarioLider = this.reportForm.controls.idUsuarioLider.value;
        this.modelo.idUsuario = this.reportForm.controls.idUsuario.value;
        this.modelo.idCargo = this.reportForm.controls.idCargo.value;
        this.modelo.idArea = this.reportForm.controls.idArea.value;

        var modeloEnviar: ReportePeticion = new ReportePeticion();

        Object.assign(modeloEnviar, this.modelo);

        this.enviarModelo.emit(modeloEnviar);
    }

    configuracionParaIniciar() {
        this.modeloSemana = this.ultimaSemana();
        this.llenarModeloFechaSemana(this.modeloSemana);
        this.todosUsuarioLider = new Usuario();
        this.todosAreas = new Area();
        this.todosCargos = new Cargo();
        this.todosAreas.idArea = 0;
        this.todosAreas.nombre = 'Todos';
        this.todosCargos.idCargo = 0;
        this.todosCargos.nombre = 'Todos';
        this.todosUsuarioLider.nombre = 'Todos';
        this.todosUsuarioLider.idUsuario = 0;
        this.todosUsuarioLider.idLider = 0;
    }

    ultimaSemana() {
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result
          }
        let inicio;
        let fin;
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        var startDate = new Date(curr.setDate(first));
        inicio = "" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
        var endDate = addDays(startDate, 6);
        fin = "" + (endDate.getMonth() +1) + "/" + endDate.getDate() + "/" + endDate.getFullYear();      
        return { 'fechaInicial': new Date(inicio), 'fechaFinal': new Date(fin) };    
    }

    fechasInvalidas() {
        let fechaInicial = new Date(this.reportForm.controls.fechaInicialView.value.singleDate.jsDate);
        let fechaFinal = new Date(this.reportForm.controls.fechaFinalView.value.singleDate.jsDate);

        if (fechaInicial.getTime() <= fechaFinal.getTime()) {
            return false;
        }
        else if (fechaInicial.getTime() > fechaFinal.getTime())
            return true
        else
            return true
    }

    llenarModeloFechaSemana(modeloSemana) {
        this.modelo.fechaInicialView = new MyDatePicker(modeloSemana.fechaInicial);
        this.modelo.fechaFinalView = new MyDatePicker(modeloSemana.fechaFinal);
        this.reportForm.patchValue(this.modelo);
    }

    async llenarListas() {
        let data = this.getDefaultParams('nombre');

        if (this.esResponsableSaludEmocional()) {
            this.reportForm.controls.idUsuarioLider.setValue(0);
            this.reportForm.controls.idCargo.setValue(0);
            this.reportForm.controls.idArea.setValue(0);
            this.reportForm.controls.idUsuario.setValue(0);
            this._dataCargos = (await this._cargosService.listar(data)).listCargoRespuesta;
            this._dataCargos.unshift(this.todosCargos);
            this._dataAreas = (await this._areasService.listar(data)).listAreaRespuesta;
            this._dataAreas.unshift(this.todosAreas);

            this.llenarUsuariosLider();
            this.onLlenarUsuariosByLider(0);

            this.enviarModeloGrafica();
        }
        if (this.esOtro()) {
            this.reportForm.controls.idUsuarioLider.setValue(0);
            data.Filtros.push(new FilterItem('AND', 'IdPerfil', '=', EnumPerfiles.LiderEquipo.toString()));
            this._dataUsuariosLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;
            this._dataUsuariosLider.unshift(this.todosUsuarioLider);

            this.enviarModeloGrafica();
            this.soloLecturaControles();
        }
        if (this.esLider()) {
            this.reportForm.controls.idUsuarioLider.setValue(this._sessionHelperService.getSessionUser().idUsuario);
            data.Filtros.push(new FilterItem('AND', 'IdUsuario', '=', this._sessionHelperService.getSessionUser().idUsuario.toString()));
            this._dataUsuariosLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;

            this.onLlenarUsuariosByLider(this._sessionHelperService.getSessionUser().idUsuario)

            this.enviarModeloGrafica();
            this.soloLecturaControles();
        }
        if (this.esUsuario()) {
            this.reportForm.controls.idUsuarioLider.setValue(this._sessionHelperService.getSessionUser().idLider);
            this.reportForm.controls.idUsuario.setValue(this._sessionHelperService.getSessionUser().idUsuario);

            data.Filtros.push(new FilterItem('AND', 'IdUsuario', '=', this._sessionHelperService.getSessionUser().idLider.toString()));
            this._dataUsuariosLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;

            data.Filtros = []
            data = this.getDefaultParams('nombre');
            data.Filtros.push(new FilterItem('AND', 'IdUsuario', '=', this._sessionHelperService.getSessionUser().idUsuario.toString()));
            this._dataUsuariosByLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;

            this.enviarModeloGrafica();
            this.soloLecturaControles();
        }
    }

    async llenarUsuariosLider() {
        let data = this.getDefaultParams('nombre');

        data.Filtros.push(new FilterItem('AND', 'IdPerfil', '=', EnumPerfiles.LiderEquipo.toString()));

        if (this.idPerfilSesion == EnumPerfiles.ResponsableSaludEmocional) //Sólo pueden ver los que tengan asignados
            data.Filtros.push(new FilterItem('AND', 'IdEncargadoSaludEmocional', '=', this._sessionHelperService.getSessionUser().idUsuario.toString()));

        this._dataUsuariosLider = (await this._usuarioService.listar(data)).listUsuarioRespuesta;
        this._dataUsuariosLider.unshift(this.todosUsuarioLider);
    }

    esLider() {
        if (this.idPerfilSesion == EnumPerfiles.LiderEquipo) {
            return true
        }
    }

    esUsuario() {
        if (this.idPerfilSesion > EnumPerfiles.Administrador &&
            this.idPerfilSesion != EnumPerfiles.ResponsableSaludEmocional &&
            this.idPerfilSesion != EnumPerfiles.LiderEquipo &&
            this.idPerfilSesion != EnumPerfiles.Consulta) {
            return true
        }
    }

    esResponsableSaludEmocional() {
        if (this.idPerfilSesion == EnumPerfiles.ResponsableSaludEmocional) {
            return true
        }
    }

    esConsulta() {
        if (this.idPerfilSesion == EnumPerfiles.Consulta) {
            this._soloLectura = true;
        }
    }

    esOtro() {
        if (this.idPerfilSesion != EnumPerfiles.ResponsableSaludEmocional &&
            this.idPerfilSesion != EnumPerfiles.LiderEquipo &&
            this.idPerfilSesion <= EnumPerfiles.Administrador ||
            this.idPerfilSesion == EnumPerfiles.Consulta) {
            return true
        }
    }

    soloLecturaControles() {
        this.esConsulta()
        if (this._soloLectura) {
            this.reportForm.controls.fechaInicialView.disable();
            this.reportForm.controls.fechaFinalView.disable();
            this.reportForm.controls.idUsuarioLider.disable();
            this.reportForm.controls.idUsuario.disable();
            this.reportForm.controls.idCargo.disable();
            this.reportForm.controls.idArea.disable();
        }
        if (this.esOtro()) {
            this.reportForm.controls.idUsuarioLider.disable();
            this.reportForm.controls.idUsuario.disable();
            this.reportForm.controls.idCargo.disable();
            this.reportForm.controls.idArea.disable();
        }
        if (this.esLider() || this.esUsuario()) {
            this.reportForm.controls.idUsuarioLider.disable();
            this.reportForm.controls.idUsuario.disable();
            this.reportForm.controls.idCargo.disable();
            this.reportForm.controls.idArea.disable();
        }
    }
}