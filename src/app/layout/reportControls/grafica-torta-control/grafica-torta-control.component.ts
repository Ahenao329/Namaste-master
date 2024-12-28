import { Component, Input, OnInit } from "@angular/core";
import { BaseGrafica } from "app/layout/generalPages/BasePages/baseGrafica";
import { routerTransition } from "app/router.animations";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import * as pluginLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-grafica-torta-control',
  templateUrl: './grafica-torta-control.component.html',
  animations: [routerTransition()]
})

export class GraficaPieControlComponent extends BaseGrafica implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;
  public mostrarGrafica: boolean = false;

  public dataConfig: any;
  public dataConfigAll: any;
  public pieChartPlugins = [];

  @Input('dataConfig')
  set dataConfigEnt(dataConfigIn: any) {
    this.dataConfig = dataConfigIn;
  }
  public chartType: string = 'pie';
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);
    this.titulo = 'gráfica pie';
  }

  ngOnInit() {
    this.obtenerPermisos();
    this.pieChartPlugins = [pluginLabels];
    this.dataConfigAll = this.prepararDatosGrafica(this.dataConfig, this.chartType);
    this.inicializar(true);
  }

  inicializar(parametro: boolean) {
    this.mostrarGrafica = parametro;
  }
}