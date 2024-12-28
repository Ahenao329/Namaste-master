import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SeparadoresNumeroPipe } from '../../../shared/pipes/shared-pipes.module';

import { BaseListPage } from '../../generalPages/BasePages/BaseListPage';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { ParametroHTMLService } from '../../../services/generalService/parametroHTML.service';
import { ParametroHTMLListarRespuesta } from '../../../models/generalModels/transferObjects/parametroHTMLListarRespuesta.model';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { ParametroHTML } from 'app/models/generalModels/parametroHTML.model';

@Component({
  templateUrl: './parametro-html-listar.template.html',
  animations: [routerTransition()]
})

export class ParametroHTMLListarComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;

  constructor(
    private _router: Router,
    private _adminService: ParametroHTMLService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.ParametroHTML);
    this.titulo = 'Parámetro HTML';

    this._adminService.inicializar(ParametroHTML, ParametroHTMLListarRespuesta, "ParametroHTML");

    this.setOrdenInicial("nombre", "ASC")

    this.fields = [
      {
        name: 'idParametroHTML',
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
      }

    ];
  }

  async  ngOnInit() {
    await this.obtenerPermisos();
    this.getDefaultParams();

    this._puedeCrear = this._recursoPerfil.Crea;
  }

  getFinalFilter(searchValue: string, searchField?: string) {
    if (!searchField)
      searchField = "Nombre";

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

    let datosRespuesta: ParametroHTMLListarRespuesta;
    try {
      datosRespuesta = await this._adminService.listar(data);

      this.data = datosRespuesta.listParametroHTMLRespuesta;
      this.pagination = this.parsePaginator(datosRespuesta.paginadorRespuesta);
    }
    catch (e) {
      this.manejoExcepcion(e, '/' + AppConfig.routes.dashboard);
      this.clearListState();
    }
    finally {
      this.blockUI.stop();
    }
  }

  edit = async (reg: any) => {
    this._router.navigate([AppConfig.routes.ParametrosHTMLAdmin, reg.idParametroHTML]);
  }

  /*add = async () => {
    this._router.navigate([AppConfig.routes.ParametroHTMLAdmin, 0]);
  }*/
}