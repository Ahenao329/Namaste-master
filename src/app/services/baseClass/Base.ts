import { Injectable, OnInit } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpClient, HttpHeaders, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';
import '../../Util/String';
import { SSException } from '../../shared/exceptions/ssexception';
import { AppConfig, AppConfigDin } from '../../config/app.config';
import { ApiError } from '../../models/common/ApiError';
import { EnumHTTPErrors } from '../../shared/enums/commonEnums';
import { Router } from '@angular/router';
import { usuarioLoginService } from '../generalService/usuarioLogin.service'
import { SessionHelperService } from '../helpers/sessionHelper.service'

@Injectable()
export class Base implements OnInit {
  protected apiServer = AppConfigDin.settings.apiServer;

  public url: string;
  public headers = new HttpHeaders();
  public config: any;
  public autenticado: boolean = true;

  constructor(public _http: HttpClient, private _router: Router, private _usuarioLoginService: usuarioLoginService
    , private _sessionHelperService: SessionHelperService
  ) {
    //this.url = AppConfig.endpoints.urlApi;
    this.url = this.apiServer.urlAPI;

    this.headers = this.headers.append('Content-Type', 'application/json');

    let userId: number = this._sessionHelperService.SERVICEAUTHDATA.userId;
    let pass: string = this._sessionHelperService.SERVICEAUTHDATA.pass;

    this.headers = this.headers.append('Authorization', 'Basic ' + btoa(userId.toString() + ":" + pass));

    this.config = {
      headers: this.headers
    }
  }

  ngOnInit() {

  }

  getConfigHeaders(timeOut: number = 0, conBlob: boolean = false): any {
    this.headers = new HttpHeaders();

    this.headers = this.headers.append('Content-Type', 'application/json');

    if (timeOut > 0) {
      timeOut = timeOut * 1000;//Es en ms
      let temp: string = '' + timeOut;
      this.headers = this.headers.append('timeout', temp);
    }

    let userId: number = this._sessionHelperService.SERVICEAUTHDATA.userId;
    let pass: string = this._sessionHelperService.SERVICEAUTHDATA.pass;

    this.headers = this.headers.append('Authorization', 'Basic ' + btoa(userId.toString() + ":" + pass));

    if (conBlob)
      this.config = { headers: this.headers, responseType: 'blob' };
    else
      this.config = { headers: this.headers }
      
    return this.config;
  }

  async verificarSesion(): Promise<boolean> {
    if (this.autenticado) {
      if (!this._sessionHelperService.SERVICEAUTHDATA.userId) {
        try {
          await this._usuarioLoginService.loginBackground();
        } catch (error) { }
      }
    }
    return true;
  }

  public lanzarExceptionNoExistencia() {
    var SSex: SSException = new SSException("No se encontró el registro.");
    SSex.fillParams(1000);
    throw (SSex);
  }

  public handleError(error: HttpErrorResponse) {
    //console.log(error);
    var apiError: ApiError;
    var SSex: SSException;
    let mensajeErroGeneral: string = 'Error general al consultar el backend.';
    if (error.status == EnumHTTPErrors.BAD_REQUEST) {
      try {
        apiError = Object.assign(ApiError, error.error);
        SSex = new SSException(apiError.message ? apiError.message : mensajeErroGeneral);
        SSex.fillParams(parseInt(apiError.errorCode));
      } catch (error) {
        //TODO: Refactor
        SSex = new SSException("Error general al consultar el backend.");
        SSex.fillParams(-1);
      }

      throw (SSex);
    }
    else if (error.status == EnumHTTPErrors.INTERNAL_SERVER_ERROR) {
      try {
        apiError = Object.assign(ApiError, error.error);
        SSex = new SSException(apiError.message ? apiError.message : mensajeErroGeneral);
        SSex.fillParams(parseInt(apiError.errorCode));
      } catch (error) {
        //TODO: Refactor
        SSex = new SSException("Error general al consultar el backend.");
        SSex.fillParams(-1);
      }

      throw (SSex);
    }
    else if (error.status == EnumHTTPErrors.UNAUTHORIZED) {
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

@Injectable()
export class MyFirstInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      //console.log(req);
    }
    //console.log(req);

    return next.handle(req);
  }
}
