import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfig } from "app/config/app.config";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { ReportePeticion } from "app/models/generalModels/reportePeticion.model";
import { ReporteRespuesta } from "app/models/generalModels/reporteRespuesta.model";
import { ReporteListarRespuesta } from "app/models/generalModels/transferObjects/reporteListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { ReporteGeneralService } from "app/services/businessService/reporteGeneral.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
    templateUrl: './reporte-distribucion.component.html',
    animations: [routerTransition()]
})

export class ReporteDistribucion extends BaseEditPage implements OnInit {
    public mostrarGrafica: boolean = false;
    public datosGrafica;
    public modelo: ReportePeticion;
    public datosRespuesta: ReporteRespuesta;

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _adminService: ReporteGeneralService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
        public _snackBar: MatSnackBar,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ReporteDistribucion);
        this.titulo = 'reporte distribución';
        this.modelo = new ReportePeticion();
        this.datosRespuesta = new ReporteRespuesta()
        this._adminService.inicializar(ReportePeticion, ReporteListarRespuesta, "RegistroDiarioEmocion");
    }
    async ngOnInit() {
        await this.obtenerPermisos();
    }

    datosPie(datosRespuesta: ReporteRespuesta[]) {
        let dataNumeroOcurrencias: number[] = [];
        let dataNombres: string[] = [];
        let dataColor: string[] = [];
        datosRespuesta.forEach(element => {
            if (element) {
                if (element.numeroOcurrencias == 0) {
                    dataNumeroOcurrencias.push(undefined);
                    dataColor.push(element.color);
                    //  dataNombres.push(element.nombre); // mejor no mostrar el nombre si no hay datos
                } else {
                    dataNombres.push(element.nombre);
                    dataNumeroOcurrencias.push(element.numeroOcurrencias);
                    dataColor.push(element.color);
                }
            }
        });
        let chartDatasets: Array<any> = [
            { data: dataNumeroOcurrencias, label: 'Reporte distribución' }
        ];

        let chartColors: Array<any> = dataColor;
        let chartLabels: Array<any> = dataNombres;

        let datos = { "chartDatasets": chartDatasets, "chartLabels": chartLabels, 'chartColors': chartColors };
        return this.validarOcurrencias(dataNumeroOcurrencias) ? datos : null;
    }
    validarOcurrencias(dataNumeroOcurrencias: number[]) {
        for (let index = 0; index < dataNumeroOcurrencias.length; index++) {
            if (dataNumeroOcurrencias[index]) {
                return true;
            }
        }
        return false;
    }

    async recibirModelo(modelo: ReportePeticion) {
        this.modelo = modelo;
        if (modelo.idUsuarioLider == 0) {
            modelo.idUsuarioLider = null
        }
        if (modelo.idUsuario == 0) {
            modelo.idUsuario = null
        }
        if (modelo.idCargo == 0) {
            modelo.idCargo = null
        }
        if (modelo.idArea == 0) {
            modelo.idArea = null
        }

        try {
            this.blockUI.start();
            if (this.modelo) {
                this.datosRespuesta = await this._adminService.reporteDistribucion(this.modelo);
                this.datosGrafica = await this.datosPie(Object.values(this.datosRespuesta));
                if (this.datosGrafica) {
                    this.cambioEstado(true);
                } else {
                    this.mostrarErrorSnackBar("No hay datos para los filtros actuales", 8000)
                }
            }
        }
        catch (e) {
            this.manejoExcepcion(e, '/' + AppConfig.routes.dashboard);
        }
        finally {
            this.blockUI.stop();
        }

    }

    cambioEstado(estado: boolean) {
        this.mostrarGrafica = estado;
    }
}