import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BaseGrafica } from "app/layout/generalPages/BasePages/baseGrafica";
import { routerTransition } from "app/router.animations";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: 'app-grafica-linea-control',
  templateUrl: './grafica-linea-control.component.html',
  animations: [routerTransition()]
})

export class GraficaLineControlComponent extends BaseGrafica implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public _puedeCrear: boolean = false;
  public mostrarGrafica: boolean = false;

  public dataConfig: any;

  @Input('dataConfig')
  set dataConfigEnt(dataConfigIn: any) {
    this.dataConfig = dataConfigIn;
  }

  public chartType: string = 'line';
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(
    private _router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);
    this.titulo = 'gráfica line';
  }

  ngOnInit() {
    this.obtenerPermisos();
    this.dataConfig = this.prepararDatosGrafica(this.dataConfig, this.chartType);
    this.inicializar(true);
  }

  inicializar(parametro: boolean) {
    this.mostrarGrafica = parametro;
  }
}