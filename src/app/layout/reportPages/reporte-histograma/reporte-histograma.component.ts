import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfig } from "app/config/app.config";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { FilterItem } from "app/models/appModels/filterItem.model";
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
    templateUrl: './reporte-histograma.component.html',
    animations: [routerTransition()]
})

export class ReporteHistograma extends BaseEditPage implements OnInit {
    public mostrarGrafica: boolean = false;
    public mostrarItems: boolean = false;
    public datosGrafica;
    public modelo: ReportePeticion;
    public datosRespuesta: ReporteRespuesta;
    public datosParaItemRespuesta: any;
    public datosParaItem: any[] = [];

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _adminService: ReporteGeneralService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
        public _snackBar: MatSnackBar,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ReporteHistograma);
        this.titulo = 'reporte histograma';
        this.modelo = new ReportePeticion();
        this.datosRespuesta = new ReporteRespuesta()
        this._adminService.inicializar(ReportePeticion, ReporteListarRespuesta, "RegistroDiarioEmocion");
    }

    async ngOnInit() {
        await this.obtenerPermisos();
    }

    nombreExiste(chartDatasetsBase, label) {
        for (let index = 0; index < chartDatasetsBase.length; index++) {
            if (chartDatasetsBase[index].label == label) {
                return true
            }
        }
    }

    indexNombre(chartDatasetsBase, label) {
        for (let index = 0; index < chartDatasetsBase.length; index++) {
            if (chartDatasetsBase[index].label == label) {
                return index
            }
        }
    }

    fechaExiste(dataFechas, fecha) {
        for (let index = 0; index < dataFechas.length; index++) {
            let fechaActual = new Date(dataFechas[index])
            let fechaBuscada = new Date(fecha)
            if (fechaActual.getTime() == fechaBuscada.getTime()) {
                return true;
            }
        }
    }

    fechaIndex(dataFechas, fecha) {
        for (let index = 0; index < dataFechas.length; index++) {
            let fechaActual = new Date(dataFechas[index])
            let fechaBuscada = new Date(fecha)
            if (fechaActual.getTime() == fechaBuscada.getTime()) {
                return index;
            }
        }
    }

    datosline(datosRespuesta: ReporteRespuesta[]) {
        let chartDatasetsBase = [];
        let dataFechas: Date[] = [];
        let dataColor: string[] = [];
        for (let index = 0; index < datosRespuesta.length; index++) {
            if (!chartDatasetsBase.length) {
                chartDatasetsBase.push({ data: [datosRespuesta[index].numeroOcurrencias], label: datosRespuesta[index].nombre });
                dataFechas.push(datosRespuesta[index].fecha);
                dataColor.push((datosRespuesta[index].color));
            } else {
                if (this.nombreExiste(chartDatasetsBase, datosRespuesta[index].nombre) && !this.fechaExiste(dataFechas, datosRespuesta[index].fecha)) {
                    let indexNombre = this.indexNombre(chartDatasetsBase, datosRespuesta[index].nombre);

                    for (let index1 = chartDatasetsBase[indexNombre].data.length; index1 < dataFechas.length; index1++) {
                        chartDatasetsBase[indexNombre].data.push(0);
                    }
                    chartDatasetsBase[indexNombre].data.push(datosRespuesta[index].numeroOcurrencias)
                    dataFechas.push(datosRespuesta[index].fecha);
                } else {
                    if (!this.nombreExiste(chartDatasetsBase, datosRespuesta[index].nombre) && this.fechaExiste(dataFechas, datosRespuesta[index].fecha)) {
                        let indexFecha = this.fechaIndex(dataFechas, datosRespuesta[index].fecha);
                        let data: number[] = [];
                        if (indexFecha) {
                            for (let index2 = 0; index2 < dataFechas.length - 1; index2++) {
                                data.push(0);
                            }
                            data.push(datosRespuesta[index].numeroOcurrencias);
                        } else { data.push(datosRespuesta[index].numeroOcurrencias); }

                        chartDatasetsBase.push({ data: data, label: datosRespuesta[index].nombre });
                        dataColor.push(datosRespuesta[index].color);
                    } else {
                        if (!this.nombreExiste(chartDatasetsBase, datosRespuesta[index].nombre) && !this.fechaExiste(dataFechas, datosRespuesta[index].fecha)) {
                            let data: number[] = [];
                            for (let index3 = 0; index3 < dataFechas.length; index3++) {
                                data.push(0);
                            }
                            data.push(datosRespuesta[index].numeroOcurrencias);
                            chartDatasetsBase.push({ data: data, label: datosRespuesta[index].nombre });
                            dataFechas.push(datosRespuesta[index].fecha);
                            dataColor.push((datosRespuesta[index].color));
                        } else {
                            let indexNombre = this.indexNombre(chartDatasetsBase, datosRespuesta[index].nombre);
                            let indexFecha = this.fechaIndex(dataFechas, datosRespuesta[index].fecha);
                            for (let index4 = chartDatasetsBase[indexNombre].data.length; index4 < indexFecha; index4++) {
                                chartDatasetsBase[indexNombre].data.push(0);
                            }
                            chartDatasetsBase[indexNombre].data.push(datosRespuesta[index].numeroOcurrencias);
                        }
                    }

                }
            }
        }
        for (let index = 0; index < chartDatasetsBase.length; index++) {
            for (let index0 = chartDatasetsBase[index].data.length; index0 < dataFechas.length; index0++) {
                chartDatasetsBase[index].data.push(0);
            }
        }
        let chartColors: Array<any> = dataColor;

        let chartDatasets: Array<any> = chartDatasetsBase;

        let chartLabels: Array<any> = dataFechas;

        let datos = { "chartDatasets": chartDatasets, "chartLabels": chartLabels, "chartColors": chartColors };
        return chartDatasetsBase.length != 0 ? datos : null;
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
                this.datosRespuesta = await this._adminService.reporteHistograma(this.modelo);
                this.datosGrafica = await this.datosline(Object.values(this.datosRespuesta));
                if (this.datosGrafica) {
                    this.cambioEstado(true);
                    if (this.modelo.idUsuario) {
                        let data = this.getDefaultParams("fecha")
                        data.Orden.tipoOrden = "DESC"
                        data.Filtros = [];
                        data.Filtros.push(new FilterItem('AND', 'IdUsuario', '=', this.modelo.idUsuario.toString()));
                        data.Filtros.push(new FilterItem('AND', 'Fecha', '>=', this.formatoFecha(this.modelo.fechaInicial)));
                        data.Filtros.push(new FilterItem('AND', 'Fecha', '<=', this.formatoFecha(this.modelo.fechaFinal)));
                        this.datosParaItemRespuesta = await this._adminService.listar(data);
                        this.datosParaItem = this.datosParaItemRespuesta.listRegistroDiarioEmocionRespuesta;
                        this.mostrarItems = true;
                    }
                } else {
                    this.mostrarErrorSnackBar("No hay datos para los filtros actuales", 5000)
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
    formatoFecha(fecha: Date) {
        const formatYmd = date => date.toISOString().slice(0, 10);
        let dateFormat = formatYmd(new Date(fecha));
        return dateFormat.split("-").join("");
    }

    cambioEstado(estado: boolean) {
        this.mostrarGrafica = estado;
        this.mostrarItems = false;
    }
}