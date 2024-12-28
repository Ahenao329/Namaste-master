import { Component, Input } from "@angular/core";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { ReporteRespuesta } from "app/models/generalModels/reporteRespuesta.model";
import { ReporteGeneralService } from "app/services/businessService/reporteGeneral.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: 'app-reporte-histograma-item-control',
  templateUrl: './reporte-histograma-item-control.component.html',
  styleUrls: ['./reporte-histograma-item-control.component.scss']
})
export class ReporteHistogramaItemControl extends BaseEditPage {

  @Input("model")
  set modelEnt(modelni: any) {
    if (modelni) {
      this.modelo = modelni;
    }
  }

  nombreIcono: string;
  public modelo: any;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    protected _reporteGeneralService: ReporteGeneralService,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ReporteHistograma);
    this.modelo = new ReporteRespuesta();
  }
  ngOnInit() {
    this.modelo.fecha = this.formatoFecha(this.modelo.fecha);
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
}