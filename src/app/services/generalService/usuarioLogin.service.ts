import { Injectable, Output, EventEmitter } from "@angular/core";
import { Usuario } from '../../models/generalModels/usuario.model';
import { LoginRespuesta } from '../../models/generalModels/loginRespuesta.model';
import { SessionData } from '../../models/appModels/sessionData';
import { SessionStorageHelperService } from '../helpers/sessionStorageHelper.service'
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig, AppConfigDin } from '../../config/app.config';
import { SessionHelperService } from '../helpers/sessionHelper.service'
import { EnumHTTPErrors } from "../../shared/enums/commonEnums";
import { ApiError } from "../../models/common/ApiError";
import { SSException } from "../../shared/exceptions/ssexception";
import { Router } from "@angular/router";
import { DataToPersist } from "../../models/appModels/dataToPersist.model";
import { EstablecerContrasenaPeticion } from "../../models/generalModels/establecerContrasenaPeticion.model";
import { EstablecerContrasenaRespuesta } from "../../models/generalModels/establecerContrasenaRespuesta.model";
import { RecuperarContrasenaPeticion } from "../../models/generalModels/recuperarContrasenaPeticion.model";
import { MessageServiceHelper } from "../helpers/messageServiceHelper.service";
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class usuarioLoginService {
  protected apiServer = AppConfigDin.settings.apiServer;
  public url: string;
  public headers = new HttpHeaders();
  public config: any;

  //sesionIniciada: EventEmitter<boolean> = new EventEmitter();

  constructor(public _http: HttpClient
    , public _sessionHelperService: SessionHelperService
    , private _router: Router
    , public _messageServiceHelper: MessageServiceHelper
    , protected _sessionStorageHelperService: SessionStorageHelperService) {
    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;
    this.headers = this.headers.append('Content-Type', 'application/json');

    this.config = {
      headers: this.headers
    }

  }

  async iniciarSesion(datos: Usuario): Promise<LoginRespuesta> {

    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;

    let temp: string = JSON.stringify(datos);

    let loginRespuesta: LoginRespuesta = new LoginRespuesta();
    await this._http.post<LoginRespuesta>(this.url.format("Usuario", "Login"), datos, this.config)
      .toPromise()
      .then(res => {
        loginRespuesta = Object.assign(loginRespuesta, res);
      })
      .catch(error => {
        this.handleError(error);
      });
    return loginRespuesta;
  }

  async loginBackground(): Promise<boolean> {
    let usuario: Usuario;
    let loginRespuesta: LoginRespuesta = new LoginRespuesta();
    let retorno: boolean = false;

    let sessionData: SessionData = this._sessionStorageHelperService.GetSessionData();

    //Importante: Esto es particular de Carriel, para habilitar la zona pública sin alterar mucho la base FrontEnd y BackEnd
    if (!sessionData) {
      sessionData = new SessionData();
      sessionData.user = 'public@sspublicaciones.com';
      sessionData.password = 'Carriel*88';
    }

    if (sessionData) {
      usuario = new Usuario();
      usuario.email = sessionData.user;
      usuario.contrasena = sessionData.password;
      loginRespuesta = await this.iniciarSesion(usuario);

      usuario = loginRespuesta.usuario;

      if (usuario.idUsuario != null && usuario.idUsuario != 0) {
        this.preparaSesion(loginRespuesta, sessionData.password);
        retorno = true;
      }
    }

    return retorno;
  }

  async login(usuario: Usuario, noCerrarSesion: boolean = true): Promise<Usuario> {
    let contrasenaSinEncriptar: string = usuario.contrasena;
    let loginRespuesta: LoginRespuesta = new LoginRespuesta();

    loginRespuesta = await this.iniciarSesion(usuario);

    usuario = loginRespuesta.usuario;
    if (usuario.idUsuario != null && usuario.idUsuario != 0) {
      let sessionData: SessionData = new SessionData();

      sessionData.loginDate = new Date();
      sessionData.user = usuario.email;
      sessionData.password = contrasenaSinEncriptar;
      sessionData.imagen = usuario.rutaImagenFrontEnd;

      //Almacenar en localstorage para autologin
      if (noCerrarSesion && !environment.production) //Si es desarrollo, guarde credenciales en localStorage
      {
        usuario.contrasena = contrasenaSinEncriptar;
        //this._sessionHelperService.setDataLoginLocalStorage(usuario);
      }

      this.preparaSesion(loginRespuesta, contrasenaSinEncriptar);
    }
    return usuario;
  }

  preparaSesion(loginRespuesta: LoginRespuesta, contrasenaSinEncriptar: string) {
    let usuario: Usuario;
    let mySession: SessionData = new SessionData();

    usuario = loginRespuesta.usuario;

    mySession.user = usuario.email;
    mySession.password = contrasenaSinEncriptar;
    mySession.loginDate = new Date();
    mySession.imagen = usuario.rutaImagenFrontEnd;
    mySession.userId = usuario.idUsuario;
    mySession.roleId = usuario.idPerfil;

    let _storageService: SessionStorageHelperService = new SessionStorageHelperService();
    _storageService.SetSessionData(mySession);

    this._sessionHelperService.SERVICEAUTHDATA.userId = usuario.idUsuario;
    this._sessionHelperService.SERVICEAUTHDATA.pass = contrasenaSinEncriptar;
    this._sessionHelperService.SERVICEAUTHDATA.login = usuario.email;
    this._sessionHelperService.SERVICEAUTHDATA.rolId = usuario.idPerfil;

    this._sessionHelperService.inicializar(loginRespuesta);

    //Emit event to sidebar, to preparing menu
    /*setTimeout(() => {
      this._messageServiceHelper.sendMessage("reload");  
    }, 200); */
  }


  async validarTokenEstablecerContrasena(datos: EstablecerContrasenaPeticion): Promise<EstablecerContrasenaRespuesta> {
    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;

    let retorno: EstablecerContrasenaRespuesta = new EstablecerContrasenaRespuesta();
    await this._http.post<Usuario>(this.url.format("Usuario", "ValidarTokenContrasena"), datos, this.config)
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async establecerContrasena(datos: EstablecerContrasenaPeticion): Promise<EstablecerContrasenaRespuesta> {
    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;

    let retorno: EstablecerContrasenaRespuesta = new EstablecerContrasenaRespuesta();
    await this._http.post<Usuario>(this.url.format("Usuario", "EstablecerContrasena"), datos, this.config)
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async recuperarContrasena(datos: RecuperarContrasenaPeticion): Promise<boolean> {
    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;

    let retorno: boolean;
    await this._http.post<Usuario>(this.url.format("Usuario", "RecuperarContrasena"), datos, this.config)
      .toPromise()
      .then(res => {
        retorno = Boolean(res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  public handleError(error: HttpErrorResponse) {
    var apiError: ApiError;
    var SSex: SSException;
    if (error.status == EnumHTTPErrors.INTERNAL_SERVER_ERROR) {
      try {
        apiError = Object.assign(ApiError, error.error);
        SSex = new SSException(apiError.message);
        SSex.fillParams(parseInt(apiError.errorCode));
      } catch (error) {
        //TODO: Refactor
        SSex = new SSException("Error general al consultar el backend.");
        SSex.fillParams(-1);
      }

      throw (SSex);
    } else if (error.status == EnumHTTPErrors.BAD_REQUEST) {
      try {
        apiError = Object.assign(ApiError, error.error);
        SSex = new SSException(apiError.message);
        SSex.fillParams(parseInt(apiError.errorCode));
      } catch (error) {
        //TODO: Refactor
        SSex = new SSException("Error general al consultar el backend.");
        SSex.fillParams(-1);
      }
      throw (SSex);
    } else if (error.status == EnumHTTPErrors.UNAUTHORIZED) {
      this._router.navigate([AppConfig.routes.login]);
    }
    else if (error.status == EnumHTTPErrors.NODISPONIBLE || error.status == EnumHTTPErrors.REQUEST_TIMEOUT
      || error.status == EnumHTTPErrors.SERVICE_UNAVAILABLE) {
      SSex = new SSException("El backend está temporalmente no disponible, por favor inténtelo más tarde.");
      SSex.fillParams(-1);
      throw (SSex);
    }
    else {
      SSex = new SSException("Error general al consultar el backend. Código: " + error.status);
      SSex.fillParams(-1);
      throw (SSex);
    }
  };
}
