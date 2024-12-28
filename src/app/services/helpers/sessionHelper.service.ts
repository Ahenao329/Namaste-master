import { Injectable } from '@angular/core';
import { Usuario } from '../../models/generalModels/usuario.model';
import { Parametro } from '../../models/generalModels/parametro.model';
import { RecursosXPerfil } from '../../models/generalModels/recursosXPerfil.model';
import { LoginRespuesta } from '../../models/generalModels/loginRespuesta.model';
import { EnumParametros } from '../../shared/enums/commonEnums';
import { EnumRecursos } from '../../shared/enums/commonEnums';
import { RecursosPerfil } from '../../models/appModels/recursosPerfil';
import { ListState } from '../../models/appModels/listState.model';
import { DataToPersist } from '../../models/appModels/dataToPersist.model';
import { LocalStorageHelper } from './localStorageHelper.service';
import { AppConfigDin } from 'app/config/app.config';
import { Component } from '@angular/core';
import { SessionStorageHelperService } from './sessionStorageHelper.service';

@Injectable({ providedIn: 'root' })
export class SessionHelperService {

  protected apiServer = AppConfigDin.settings.apiServer;

  private _usuario: Usuario;
  private _listParametros: Parametro[];
  private _listRecursosXPerfil: RecursosXPerfil[];

  public sessionGlobal: string = "es";
  public sessionLocal: string = "es-CO";

  public FormatoFecha: string = "dd/MM/yyyy";
  public FormatoFechaLarga: string = "dd/MM/yyyy HH:mm";

  public FormatoFechaCanonica: string = "yyyyMMdd";

  public listState: ListState;
  public listState2: ListState;

  public _lastLoginDate: Date;

  public SERVICEAUTHDATA =
    {
      login: '',
      userId: 0,
      pass: '',  
      rolId: 0   
    }

  constructor(protected _localStorageHelper: LocalStorageHelper) {

  }

  inicializar(data: LoginRespuesta) {
    this._usuario = data.usuario;
    this._listParametros = data.listParametros;
    this._listRecursosXPerfil = data.listRecursosXPerfil;

    this._lastLoginDate = new Date();


    //Específico ProyectoX

  }

  actualizarNombreUsuarioMostrar(nombre:string)
  {
    this._usuario.nombre = nombre;
  }

  getSessionUser(): Usuario {
    return this._usuario;
  }

  getParametroValor(parametro: EnumParametros): string {
    let retorno = "";
    let param: Parametro[];

    try {
      param = this._listParametros.filter(param => param.idParametro === parametro);
    } catch (ex) {
    }

    if (param && param.length > 0)
      retorno = param[0].valor;

    return retorno;
  }

  existeSesion(): boolean {
    let retorno: boolean = false;

    if (this._usuario) {
      let time = new Date();
      time.setHours(time.getHours() + 6); //Forzar relogin si han pasado mas de 6 horas

      if (this._lastLoginDate && this._lastLoginDate < time)
        retorno = true;
    }


    return retorno;
  }

  getToken(): string {
    let retorno: string = '';

    if (this._usuario)
      retorno = this._usuario.token;
    return retorno;
  }

  getPermisosRecurso(recurso: EnumRecursos): RecursosPerfil {
    let retorno: RecursosPerfil = new RecursosPerfil();
    let recursosXPerfil: RecursosXPerfil[];

    if (this._listRecursosXPerfil) {
      try {
        let perfil: number = this._usuario.idPerfil;
        recursosXPerfil = this._listRecursosXPerfil.filter(param => param.idPerfil === perfil && param.idRecurso === recurso);
      } catch (ex) {
      }

      if (recursosXPerfil && recursosXPerfil.length > 0) {
        retorno.CodigoPerfil = recursosXPerfil[0].idPerfil;
        retorno.CodigoRecurso = recursosXPerfil[0].idRecurso;
        retorno.Consulta = recursosXPerfil[0].consulta ;
        retorno.Crea = recursosXPerfil[0].crea ;
        retorno.Ejecuta = recursosXPerfil[0].ejecuta ;
        retorno.Elimina = recursosXPerfil[0].elimina ;
        retorno.Modifica = recursosXPerfil[0].modifica ;
        retorno.Opcional1 = recursosXPerfil[0].opcional1 ;
        retorno.Opcional2 = recursosXPerfil[0].Opcional2 ;
      }
    }

    return retorno;
  }


  //Específicos [nombre sistema]





}