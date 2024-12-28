import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { BaseListPage } from '../BasePages/BaseListPage'
import { AppConfig } from '../../../config/app.config';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { UsuarioService } from '../../../services/generalService/usuario.service';
import { UsuarioListarRespuesta } from '../../../models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { Usuario } from 'app/models/generalModels/usuario.model';
import { FilterItem } from 'app/models/appModels/filterItem.model';

@Component({
  templateUrl: './usuario-listar.component.html',
  animations: [routerTransition()]
})

export class UsuarioListarComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;

  constructor(
    private _router: Router,
    private _adminService: UsuarioService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);
    this.titulo = 'Usuario';

    this._adminService.inicializar(Usuario, UsuarioListarRespuesta, "Usuario");

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
        name: 'perfilNombre',
        display: 'Perfil',
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
      //,{ operadorLogico: "AND", campoFiltro: 'identificacion', condicional: "IN", valor: '71000002,71000003,71000004,71000005,71000006' }      
    ];
  }

  query = async (data: any, searchField?: string, searchValue?: string) => {
    this.blockUI.start();

    let operador: string = '';
    if (searchValue) {
      data.Filtros = this.getFinalFilter(searchField, searchValue);
      operador = 'AND';
    }

    data.Filtros.push(new FilterItem(operador, 'IdUsuario', '>', '1'));//Para que no muestre usuarios comodín

    this.currentTransfer = data;

    this.setListState(data, searchValue, searchField);

    let datosRespuesta: UsuarioListarRespuesta;
    try {

      datosRespuesta = await this._adminService.listar(data);
      this.data = datosRespuesta.listUsuarioRespuesta;
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
    this._router.navigate([AppConfig.routes.UsuariosAdmin, reg.idUsuario]);
  }

  add = async () => {
    this._router.navigate([AppConfig.routes.UsuariosAdmin, 0]);
  }
}