import { Component, OnInit } from "@angular/core";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseCorePage } from "./BaseCorePage";

@Component({
    template: ''
})
export class BaseGrafica extends BaseCorePage implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;
    public dataConfig: Object;

    constructor(protected _sessionHelperService: SessionHelperService, protected _usuarioLoginService: usuarioLoginService,
        protected _recursoIni: EnumRecursos) {
        super(_sessionHelperService, _usuarioLoginService, _recursoIni);
    }

    public chartDatasets: Array<any> = [];

    public chartLabels: Array<any> = [];

    public chartColors: Array<any> = [
        {
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
        }
    ];

    public chartOptions: any = {
        legend: { display: true, labels: { fontColor: 'black' } },
        responsive: true,
        elements: {
            line: {
                tension: 0, // disables bezier curves
            }
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    let totalOcurrencias: number = 0
                    let ocurrencias = ctx.dataset.data;
                    ocurrencias.forEach(element => {
                        if (element) {
                            totalOcurrencias += element;
                        }
                    });
                    return value ? Math.round((value * 100) / totalOcurrencias) + '%' : undefined;
                },
                color: "white",
            },
        },
    };

    ngOnInit() {
        this.obtenerPermisos();
    }

    formatoFecha(fecha: Date) {
        let date = new Date(fecha)
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        if (month < 10) {
            return `${day}-0${month}-${year}`
        } else {
            return `${day}-${month}-${year}`
        }
    }

    prepararDatosGrafica(dataConfig, tipoGráfica: string) {
        this.chartDatasets = dataConfig.chartDatasets;
        this.chartLabels = dataConfig.chartLabels;
        if (tipoGráfica == 'line') {
            this.crearColoresLine(dataConfig.chartDatasets, dataConfig.chartColors);
            for (let index = 0; index < this.chartLabels.length; index++) {
                this.chartLabels[index] = this.formatoFecha(this.chartLabels[index])
            }
        } else {
            this.chartColors[0].backgroundColor = dataConfig.chartColors;
        }
        this.dataConfig = { "chartDatasets": this.chartDatasets, "chartLabels": this.chartLabels, "chartColors": this.chartColors, "chartOptions": this.chartOptions };
        return this.dataConfig;
    }

    crearColoresLine(arrayData, arrayColor) {
        this.chartColors = [];
        for (let index = 0; index < arrayData.length; index++) {
            if (this.chartColors.length < arrayData.length) {
                this.chartColors.push({
                    backgroundColor: ["transparent"],
                    borderColor: [],
                    borderWidth: 2,
                    pointBackgroundColor: arrayColor[index],
                    pointBorderColor: arrayColor[index],
                })
            }
            this.chartColors[index].borderColor.push(arrayColor[index])
        }
    }
}