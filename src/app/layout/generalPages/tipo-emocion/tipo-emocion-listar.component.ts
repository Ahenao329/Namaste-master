import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'app/config/app.config';
import { FilterItem } from 'app/models/appModels/filterItem.model';
import { TipoEmocion } from 'app/models/generalModels/tipoEmocion.model';
import { TipoEmocionListarRespuesta } from 'app/models/generalModels/transferObjects/tipoEmocionListarRespuesta.model';
import { routerTransition } from 'app/router.animations';
import { TipoEmocionService } from 'app/services/generalService/tipoEmocion.service';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';
import { EnumRecursos } from 'app/shared/enums/commonEnums';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseListPage } from '../BasePages/BaseListPage';

@Component({
  selector: 'app-tipo-emocion-listar',
  templateUrl: './tipo-emocion-listar.component.html',
  animations: [routerTransition()]
})
export class TipoEmocionListarComponent extends BaseListPage implements OnInit  {
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(
    private _router: Router,
    private _adminService: TipoEmocionService,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
  ) {

    
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.DiaFestivo);

    this._adminService.inicializar(TipoEmocion, TipoEmocionListarRespuesta, "TipoEmocion");

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
      // {
      //   name: 'color',
      //   display: 'Color',
      //   align: 1,
      //   allowSorting: true,
      //   formatter: ''
      // },
      // {
      //   name: 'rutaImagen',
      //   display: 'IMG',
      //   align: 1,
      //   allowSorting: true,
      //   formatter: ''
      // },
      {
        name: 'criticidad',
        display: 'Criticidad',
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
    
    // this._puedeCrear = this._recursoPerfil.Crea;
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
    data.Filtros.push(new FilterItem(operador, 'IdTipoEmocion', '>', '0'));


    this.currentTransfer = data;

    this.setListState(data, searchValue, searchField);


    let datosRespuesta: TipoEmocionListarRespuesta;
    try {
        datosRespuesta = await this._adminService.listar(data);

        this.data = datosRespuesta.listTipoEmocionRespuesta;

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
    this._router.navigate([AppConfig.routes.TipoEmocionAdmin, reg.idTipoEmocion]);
   }
 
   add = async () => {
  this._router.navigate([AppConfig.routes.TipoEmocionAdmin, 0]);
   }
 
   
}
