import { Injectable } from '@angular/core';
import { BaseCorePage } from './BaseCorePage';
import { PaginadorRespuesta } from '../../../models/common/PaginadorRespuesta';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { EnumParametros, EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { ListState } from '../../../models/appModels/listState.model';
import { ListStateFilters } from '../../../models/appModels/listStateFilters.model';


export class BaseListPage extends BaseCorePage {

  public titulo: string;
  //public confirmado: any;

  public currentTransfer: any;
  public fields: Array<any>;
  public data: Array<any>;
  public pagination: any;
  public sorting: any;

  public searchValue: string='';
  public searchField: string='';

  public campoOrden: string = "Nombre--";
  public tipoOrden: string = "ASC";

  private paginaActualIni: number = 1;

  public ListFiltrosEstado:ListStateFilters[];

  constructor(protected _sessionHelperService: SessionHelperService, protected _usuarioLoginService: usuarioLoginService,
    protected _recursoIni: EnumRecursos,protected _esPopUp = false) {
    super(_sessionHelperService, _usuarioLoginService, _recursoIni);

    this.initListState();
    this.currentTransfer = this.getDefaultParams();

    this.sorting = this.currentTransfer.Orden;
    this.pagination = this.currentTransfer.Paginador;
    this.searchValue = this.currentTransfer.searchValue;

    this.data = [];
  }

  getDefaultParams(conMaxRegs: boolean = false) {
    let registrosPorPaginaTemp: string
    if (conMaxRegs)
      registrosPorPaginaTemp = this._sessionHelperService.getParametroValor(EnumParametros.RegistrosPorPaginaMax);
    else
      registrosPorPaginaTemp = this._sessionHelperService.getParametroValor(EnumParametros.RegistrosPorPagina);

    let registrosPorPaginaNumber: number = Number(registrosPorPaginaTemp ? registrosPorPaginaTemp : 10);

    let defaultParams = {
      Orden: { campoOrden: this.campoOrden, tipoOrden: this.tipoOrden },
      Paginador: {
        paginaActual: this.paginaActualIni,
        registrosPagina: registrosPorPaginaNumber,
      },
      Filtros: [],
      RetornarSinEspecificar: false,
      searchValue: this.searchValue
    };

    return defaultParams;
  }


  getDefaultParamsL(campoOrden: string, idFiltro: string = null, valorFiltro: string = null,operadorActivo:string="OR") {
    let registrosPorPaginaTemp: string = this._sessionHelperService.getParametroValor(EnumParametros.RegistrosPorPaginaMax);
    let registrosPorPaginaNumber: number = Number(registrosPorPaginaTemp ? registrosPorPaginaTemp : 10);

    let defaultParams = {
      Orden: { campoOrden: campoOrden, tipoOrden: "ASC" },
      Paginador: {
        paginaActual: 1,
        registrosPagina: registrosPorPaginaNumber,
      },
      Filtros: [],
      RetornarSinEspecificar: false,
      searchValue: ""
    };

    if (idFiltro && valorFiltro) {
      defaultParams.Filtros = [{ operadorLogico: "", campoFiltro: idFiltro, condicional: "=", valor: valorFiltro },
      { operadorLogico: operadorActivo, campoFiltro: 'Activo', condicional: "=", valor: 1 }];
    }

    return defaultParams;
  }


  setOrdenInicial(campoOrden: string, tipoOrden: string) {
    let listState: ListState = this._sessionHelperService.listState;

    //Solo se establecen, si no viene de la edicion, y mantiene el estado.
    if (!(listState && listState.Recurso == this._recurso && this._recursoEstado == EnumRecursos.SinEspecificar)) {
      this.campoOrden = campoOrden;
      this.tipoOrden = tipoOrden;
    }

    this.sorting = { campoOrden: this.campoOrden, tipoOrden: this.tipoOrden };

    if (this.searchField == null)
      this.searchField = this.campoOrden;
  }

  private initListState() {
    let listState: ListState;

    if (this._recursoEstado != EnumRecursos.SinEspecificar)
      listState = this._sessionHelperService.listState2;
    else
      listState = this._sessionHelperService.listState;

    if (listState && listState.Recurso == this._recurso && !this._esPopUp) {
      this.campoOrden = listState.Orden.campoOrden;
      this.tipoOrden = listState.Orden.tipoOrden;

      this.paginaActualIni = listState.PaginaActual;

      this.searchValue = listState.Busqueda.value;
      this.searchField = listState.Busqueda.field;

      this.ListFiltrosEstado = listState.OtrosFiltros;
    }
    else if (this._recursoEstado == EnumRecursos.SinEspecificar && !this._esPopUp)//Limpie solo si pagina de primer nivel de profundidad y no es popup
      this._sessionHelperService.listState = null;

  }

  //Apoya la recuperación del estado para filtros específicos de la página
  getValorItemEstado(id:number):any{
    let retorno:any;
    let items:Array<any> = this.ListFiltrosEstado.filter(param => param.Id === id);

    if (items && items.length>0)
      retorno = items[0].Valor;

    return retorno;
  }

  setListState(data: any, searchField: string, searchValue: string,filtros:ListStateFilters[]=null) {

    if (data != null && data.Orden != null) {
      let listState: ListState = new ListState();

      listState.Busqueda = { field: searchField, value: searchValue };

      listState.Orden = { campoOrden: data.Orden.campoOrden, tipoOrden: data.Orden.tipoOrden };

      listState.PaginaActual = this.pagination.paginaActual;

      listState.OtrosFiltros = filtros;

      if (this._recursoEstado != EnumRecursos.SinEspecificar) {
        listState.Recurso = this._recursoEstado;
        this._sessionHelperService.listState2 = listState;
      }
      else {
        listState.Recurso = this._recurso;
        this._sessionHelperService.listState = listState;
      }
    }
  }

  parsePaginator(paginador: PaginadorRespuesta) {
    paginador.primerRegistro = ((paginador.paginaActual - 1) * paginador.registrosPagina) + 1
    paginador.ultimoRegistro = paginador.paginaActual * paginador.registrosPagina;
    if (paginador.numeroPaginas <= 0) paginador.numeroPaginas = 1;
    if (paginador.totalRegistros < paginador.ultimoRegistro) paginador.ultimoRegistro = paginador.totalRegistros;

    return paginador;
  }
}