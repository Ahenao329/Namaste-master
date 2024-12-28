import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { Cargo } from "app/models/generalModels/cargo.model";
import { CargoListarRespuesta } from "app/models/generalModels/transferObjects/cargoListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { CargoService } from "app/services/generalService/cargo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseListPage } from "../BasePages/BaseListPage";

@Component({
  templateUrl: './cargo-listar.component.html',
  animations: [routerTransition()]
})

export class CargoListarComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;

  constructor(
    private _router: Router,
    private _adminService: CargoService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Cargo);
    this.titulo = 'Cargo';

    this._adminService.inicializar(Cargo, CargoListarRespuesta, "Cargo");

    this.setOrdenInicial('nombre', 'ASC')

    this.fields = [
      {
        name: 'nombre',
        display: 'Nombre',
        align: 1,
        link: true,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'descripcion',
        display: 'Descripción',
        align: 1,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'activo',
        display: 'Activo',
        align: 2,
        allowSorting: true,
        formatter: ''
      }
    ];
  }

  async ngOnInit() {
    await this.obtenerPermisos();
    this.getDefaultParams();

    this._puedeCrear = this._recursoPerfil.Crea;
  }

  getFinalFilter(searchValue: string, searchField?: string) {
    if (!searchField)
      searchField = 'nombre';

    return [
      { operadorLogico: "", campoFiltro: searchField, condicional: "like", valor: searchValue }
    ];
  }

  query = async (data: any, searchField?: string, searchValue?: string) => {
    this.blockUI.start();

    let operador: string = '';
    if (searchValue) {
      data.Filtros = this.getFinalFilter(searchField, searchValue);
      operador = 'AND';
    }
    this.currentTransfer = data;

    this.setListState(data, searchValue, searchField);

    let datosRespuesta: CargoListarRespuesta;
    try {
      datosRespuesta = await this._adminService.listar(data);

      this.data = datosRespuesta.listCargoRespuesta;
      this.pagination = this.parsePaginator(datosRespuesta.paginadorRespuesta);
    }
    catch (e) {
      this.manejoExcepcion(e, '/' + AppConfig.routes.dashboard);
    }
    finally {
      this.blockUI.stop();
    }
  }

  edit = async (reg: any) => {
    this._router.navigate([AppConfig.routes.CargoAdmin, reg.idCargo]);
  }

  add = async () => {
    this._router.navigate([AppConfig.routes.CargoAdmin, 0]);
  }
}