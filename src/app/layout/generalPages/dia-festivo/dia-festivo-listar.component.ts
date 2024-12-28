import { DatePipe, formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { DiaFestivo } from "app/models/generalModels/dia-festivo.model";
import { DiaFestivoListarRespuesta } from "app/models/generalModels/transferObjects/diaFestivoListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { DiaFestivoService } from "app/services/generalService/diaFestivo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Console } from "console";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseListPage } from "../BasePages/BaseListPage";

@Component({
    templateUrl: './dia-festivo-listar.component.html',
    animations: [routerTransition()]
  })
  
  export class DiaFestivoListarComponent extends BaseListPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;
      
    constructor(
      private _router: Router,
      private _adminService: DiaFestivoService,
      protected _sessionHelperService: SessionHelperService,
      protected _usuarioLoginService: usuarioLoginService,
    ) {
      super(_sessionHelperService, _usuarioLoginService, EnumRecursos.DiaFestivo);
      this.titulo = 'día festivo';
  
      this._adminService.inicializar(DiaFestivo, DiaFestivoListarRespuesta, "DiaFestivo");
  
      this.setOrdenInicial('fecha', 'ASC')
  
      this.fields = [        
        {
          name: 'fecha',
          display: 'Fecha',
          align: 1,
          link: true,
          allowSorting: false,
          formatter: this._sessionHelperService.FormatoFecha,
          pipe: new DatePipe(this._sessionHelperService.sessionGlobal),
        },      
        
      ];
    }
  
    async ngOnInit() {
      await this.obtenerPermisos();
      this.getDefaultParams();
  
      this._puedeCrear = this._recursoPerfil.Crea;
    }
  
    getFinalFilter(searchValue: string, searchField?: string) {
      if (!searchField)
        searchField = 'fecha';
  
      return [
        { operadorLogico: "", campoFiltro: searchField, condicional: "like", valor: searchValue }    
      ];
    }
  
    query = async (data: any, searchField?: string, searchValue?: string) => {
      this.blockUI.start();
  
      let operador:string = '';
      if (searchValue)
      {
        data.Filtros = this.getFinalFilter(searchField, searchValue);
        operador = 'AND';
      }
  
      this.currentTransfer = data;
  
      this.setListState(data, searchValue, searchField);

      
      let datosRespuesta: DiaFestivoListarRespuesta;
      try {
        datosRespuesta = await this._adminService.listar(data);
      
        this.data = datosRespuesta.listDiaFestivoRespuesta;
        
       for (let index = 0; index < this.data.length; index++) {
        this.data[index].fecha=new Date(this.data[index].fecha);    
       }

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
     this._router.navigate([AppConfig.routes.DiaFestivoAdmin, reg.idDiaFestivo]);
    }
  
    add = async () => {
   this._router.navigate([AppConfig.routes.DiaFestivoAdmin, 0]);
    }
  
  }