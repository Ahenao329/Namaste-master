import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BaseListPage } from '../../generalPages/BasePages/BaseListPage';
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { BotonPanicoService } from '../../../services/businessService/botonPanico.service';
import { BotonPanicoListarRespuesta } from '../../../models/businessModels/transferObjects/botonPanicoListarRespuesta.model';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { BotonPanico } from 'app/models/businessModels/botonPanico.model';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { FilterItem } from 'app/models/appModels/filterItem.model';

@Component({
  templateUrl: './boton-panico-listar.template.html',
  animations: [routerTransition()]
})

export class BotonPanicoListarComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;

  constructor(
    private _router: Router,
    private _adminService: BotonPanicoService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.BotonPanico);
    this.titulo = 'Alertas de pánico';

    this._adminService.inicializar(BotonPanico, BotonPanicoListarRespuesta, "BotonPanico");

    this.setOrdenInicial("fechaCreacion", "ASC")

    this.fields = [
      {
        name: 'usuarioNombre',
        display: 'Usuario',
        align: 1,
        allowSorting: true,
        link: true,
      },
      {
        name: 'usuarioAtiendeNombre',
        display: 'Usuario atiende',
        align: 1,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'email',
        display: 'Correo electrónico',
        align: 1,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'celular',
        display: 'Celular',
        align: 1,
        allowSorting: true,
        formatter: ''
      },
      {
        name: 'fechaCreacion',
        display: 'Fecha creación',
        align: 2,
        allowSorting: true,
        formatter: this._sessionHelperService.FormatoFechaLarga,
        pipe: new DatePipe(this._sessionHelperService.sessionGlobal)
      },
      {
        name: 'fechaAtencion',
        display: 'Fecha atención',
        align: 2,
        allowSorting: true,
        formatter: this._sessionHelperService.FormatoFecha,
        pipe: new DatePipe(this._sessionHelperService.sessionGlobal)
      },

    ];
  }

  async ngOnInit() {
    this.getDefaultParams();
  }

  getFinalFilter(searchValue: string, searchField?: string) {
    if (!searchField)
      searchField = "nombre";

    return [
      { operadorLogico: "", campoFiltro: searchField, condicional: "like", valor: searchValue }
    ];
  }

  query = async (data: any, searchField?: string, searchValue?: string) => {
    await this.obtenerPermisos();
    this._puedeCrear = this._recursoPerfil.Crea;
    this.blockUI.start();
    if (searchValue)
      data.Filtros = this.getFinalFilter(searchField, searchValue);

    this.currentTransfer = data;

    this.setListState(data, searchValue, searchField);

    let datosRespuesta: BotonPanicoListarRespuesta;

    data.Filtros.push(new FilterItem('AND', 'UsuarioIdEncargadoSaludEmocional', '=', this._sessionHelperService.getSessionUser().idUsuario.toString()));
    try {
      datosRespuesta = await this._adminService.listar(data);
      this.data = datosRespuesta.listBotonPanicoRespuesta;
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
    this._router.navigate([AppConfig.routes.BotonPanicoAdmin, reg.idBotonPanico]);
  }

  add = async () => {
    this._router.navigate([AppConfig.routes.BotonPanicoAdmin, 0]);
  }
}