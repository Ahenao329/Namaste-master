import { Injectable, Inject } from '@angular/core';
import { BaseCorePage } from './BaseCorePage';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { EnumParametros, EnumRecursos } from '../../../shared/enums/commonEnums';
import { EnumTipoAlerta } from '../../generalControls/PopUpAlert/popUpAlert.component';
import { PaginadorRespuesta } from '../../../models/common/PaginadorRespuesta';
import { FormGroup, FormControl } from '@angular/forms';


export class BaseEditPage extends BaseCorePage {
  public _tituloBase: string;
  public _activoIni: boolean = true;
  public _soloLectura: boolean = false;

  //Para Listado/popup
  public data: Array<any>;
  public fields: Array<any>;
  public pagination: any;
  public sorting: any;
  public searchValue: string;
  public searchField: string;
  public campoOrden: string = "Nombre";
  public tipoOrden: string = "ASC";
  private paginaActualIni: number = 1;

  constructor(protected _sessionHelperService: SessionHelperService, protected _usuarioLoginService: usuarioLoginService,
    protected _recursoIni: EnumRecursos) {
    super(_sessionHelperService, _usuarioLoginService, _recursoIni);

    //Para Listado/popup
    let currentTransfer: any = this.getDefaultParamsPopup();

    this.sorting = currentTransfer.Orden;
    this.pagination = currentTransfer.Paginador;
    this.searchValue = currentTransfer.searchValue;

    this.data = [];
  }

  prepararIdNumero(id: string, urlError: string): number {
    let retorno: number = 0;
    let temp: number;

    temp = Number(id);

    if (!isNaN(temp))
      retorno = temp;
    else {
      this._TituloPopup = 'Error';
      this._TipoAlert = EnumTipoAlerta.Error;
      this._RutaPopUpAlert = urlError;
      this._DescripcionPopup = "Parámetros incorrectos";

      this.openDialog();
    }

    if (retorno == 0 && !this._puedeCrear)
      this.lanzarExcepcionPermisos();

    if (retorno == 0) {
      this._puedeEliminar = false;
    }
    else {
      if (!this._puedeModificar)
        this._soloLectura = true;
    }

    this.prepararTitulo(retorno);

    return retorno;
  }

  getDefaultParams(campoOrden: string, idFiltro: string = null, valorFiltro: string = null,operadorActivo:string="OR") {
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
      { operadorLogico: operadorActivo, campoFiltro: 'Activo', condicional: "=", valor: '1' }];
    }
    else    
      defaultParams.Filtros = [{ operadorLogico: '', campoFiltro: 'Activo', condicional: "=", valor: '1' }];
    
    return defaultParams;
  }

  //Para Listado/popup
  setOrdenInicial(campoOrden: string, tipoOrden: string) {
    this.campoOrden = campoOrden;
    this.tipoOrden = tipoOrden;

    this.sorting = { campoOrden: this.campoOrden, tipoOrden: this.tipoOrden };

    if (this.searchField == null)
      this.searchField = this.campoOrden;
  }

  getDefaultParamsPopup() {
    let registrosPorPaginaTemp: string
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

  parsePaginator(paginador: PaginadorRespuesta) {
    paginador.primerRegistro = ((paginador.paginaActual - 1) * paginador.registrosPagina) + 1
    paginador.ultimoRegistro = paginador.paginaActual * paginador.registrosPagina;
    if (paginador.numeroPaginas <= 0) paginador.numeroPaginas = 1;
    if (paginador.totalRegistros < paginador.ultimoRegistro) paginador.ultimoRegistro = paginador.totalRegistros;

    return paginador;
  }

  prepararTitulo(id: number) {
    if (id == 0) {
      this._puedeEliminar = false;
      this.titulo = "Crear " + this._tituloBase;
    }
    else
      this.titulo = "Modificar " + this._tituloBase;
  }
}