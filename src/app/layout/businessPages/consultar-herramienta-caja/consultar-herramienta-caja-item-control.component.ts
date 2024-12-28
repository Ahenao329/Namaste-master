import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { HerramientaCajaService } from "app/services/generalService/herramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { FunctionsHelperService } from "app/services/helpers/functionsHelper.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos, EnumTipoHerramientaCaja } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../../generalPages/BasePages/BaseEditPage";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";

@Component({
  selector: 'app-consultar-herramienta-caja-item-control',
  templateUrl: './consultar-herramienta-caja-item-control.component.html',
  styleUrls: ['./consultar-herramienta-caja-item-control.component.scss']
})

export class HerramientaCajaVisualizarItemControl extends BaseEditPage {

  @Input("model")
  set modelEnt(modelni: any) {
    if (modelni) {
      this.modelo = modelni;
    }
  }

  nombreIcono: string;
  public modelo: any;//porque el modelo en el back es diferente al del front;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    protected _herramientaCajaService: HerramientaCajaService,
    protected _functionsHelperService: FunctionsHelperService,
    public _snackBar: MatSnackBar,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.HerramientaCaja);

    this._herramientaCajaService.inicializar(HerramientaCaja, HerramientaCajaListarRespuesta, "HerramientaCaja");

    this.modelo = new HerramientaCaja();
  }
  ngOnInit() {
    if (this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Link) {
      this.nombreIcono = "link"
    }
    if (this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Documento) {
      this.nombreIcono = "file_present"
    }
  }

  async onSubmit() {
    if (this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Link) {
      await this._herramientaCajaService.incrementarNumeroConsultasLink(this.modelo.idHerramientaCaja);
      window.open(this.modelo.ruta);
    }
    if (this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Documento) {
      this.exportar()
    }
  }

  async exportar() {
    try {
      this.blockUI.start();

      let blobResponse: Blob = await this._herramientaCajaService.obtenerArchivo(this.modelo.idHerramientaCaja);

      if (blobResponse) {
        var contentType = this._functionsHelperService.getContentTypeArchivo(this.modelo.ruta.split(".")[1]);
        this._functionsHelperService.showFileFromBlob(blobResponse, this.modelo.titulo, contentType);
      }
      else
        alert('No fue posible realizar la exportación');
    }
    catch (e) {
      this.mostrarErrorSnackBar("No se encuentran archivo en equipo");
      this.manejoExcepcion(e, '/' + AppConfig.routes.HerramientaCajaBuscar);
    }
    finally {
      this.blockUI.stop();
    }
  }
}