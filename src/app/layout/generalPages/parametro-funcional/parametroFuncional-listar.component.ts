import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SeparadoresNumeroPipe } from '../../../shared/pipes/shared-pipes.module';

import { BaseListPage } from '../BasePages/BaseListPage';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { ParametroFuncionalService } from '../../../services/generalService/parametroFuncional.service';

import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { ParametroFuncionalListarRespuesta } from 'app/models/generalModels/transferObjects/parametroFuncionalListarRespuesta.model';
import { ParametroFuncional } from 'app/models/generalModels/parametroFuncional.model';

@Component({
  templateUrl: './parametroFuncional-listar.component.html',
  //providers: [ParametroFuncionalService],
  animations: [routerTransition()]
})

export class ParametroFuncionalListarComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;

  constructor(
    private _router: Router,
    private _adminService: ParametroFuncionalService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ParametroFuncional);
    this.titulo = 'parametro funcional';

    this._adminService.inicializar(ParametroFuncional, ParametroFuncionalListarRespuesta, "ParametroFuncional");

    this.setOrdenInicial("nombre", "ASC")

    this.fields = [
      {
        name: 'idParametroFuncional',
        display: 'Código',
        link: true,
        align: 3,
        allowSorting: true,
        formatter: this._sessionHelperService.sessionLocal + ':0',
        pipe: new SeparadoresNumeroPipe()
      },
      {
        name: 'nombre',
        display: 'Nombre',
        align: 1,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'valor',
        display: 'Valor',
        align: 3,
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
      searchField = "Descripcion";

    return [
      { operadorLogico: "", campoFiltro: searchField, condicional: "like", valor: searchValue }
    ];
  }

  query = async (data: any, searchField?: string, searchValue?: string) => {
    this.blockUI.start();

    if (searchValue)
      data.Filtros = this.getFinalFilter(searchField, searchValue);

    this.currentTransfer = data;

    this.setListState(data, searchValue, searchField);

    let datosRespuesta: ParametroFuncionalListarRespuesta;
    try {
      datosRespuesta = await this._adminService.listar(data);

      this.data = datosRespuesta.listParametroFuncionalRespuesta;
      this.pagination = this.parsePaginator(datosRespuesta.paginadorRespuesta);
    }
    catch (e) {
      this.manejoExcepcion(e, '/Inicio');
    }
    finally {
      this.blockUI.stop();
    }
  }

  edit = (reg: any) => {
    this._router.navigate([AppConfig.routes.ParametrosFuncionalesAdmin, reg.idParametroFuncional]);
  }

  add = () => {
    this._router.navigate([AppConfig.routes.ParametroFuncionalAdmin, 0]);
  }
}