import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseListPage } from '../../generalPages/BasePages/BaseListPage';
import { AppConfig, AppConfigDin } from '../../../config/app.config';
import { IAppConfig } from "../../../config/iapp.config";
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { Usuario } from '../../../models/generalModels/usuario.model';
import { SessionStorageHelperService } from '../../../services/helpers/sessionStorageHelper.service';
import { SessionData } from '../../../models/appModels/sessionData';
import { LocalStorageHelper } from "../../../services/helpers/localStorageHelper.service";
import { DataToPersist } from "../../../models/appModels/dataToPersist.model";
import { AvatarUsuarioComponent } from '../avatar-usuario/avatar-usuario.component';
import { PopUpFotoComponent } from '../popup-foto/popup-foto.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageServiceHelper } from 'app/services/helpers/messageServiceHelper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-usuario',
  templateUrl: './cuenta-usuario.template.html',
  styleUrls: ['./cuenta-usuario.component.scss'],
  animations: [routerTransition()]
})

export class CuentaUsuarioComponent extends BaseListPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _puedeCrear: boolean = false;
  protected apiServer = AppConfigDin.settings.apiServer;
  userForm: FormGroup;
  public modelo: Usuario;
  public _sessionData: SessionData;

  _usuario: string = '';
  _perfilUsuario: string = '';
  _mostrarDivError: boolean = false;
  _errorMostrar: string = '';
  _imagenBase64: string = '';
  _textoAgregarImagen: string = 'Agregar imagen';
  _rutaImagenExistente: string = '';
  _mostrarNueva: boolean = false;
  _appConfig: IAppConfig = AppConfig;

  @ViewChild(AvatarUsuarioComponent, { static: true })
  private avatarUsuarioInstance: AvatarUsuarioComponent;

  constructor(
    private _router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    protected _localStorageHelper: LocalStorageHelper,
    protected _sessionStorageHelperService: SessionStorageHelperService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer
    , protected _messageHelper: MessageServiceHelper
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Usuario);
    this.cargarUsuario();
    this.userForm = this.formBuilder.group({
    });
  }

  ngOnInit() {
    this.obtenerPermisos();
    this._puedeCrear = false;
    this.cargarUsuario()
    this._usuario = this.modelo.nombre;
    this._perfilUsuario = this.modelo.perfilNombre;

    if (this._sessionData != null && this._sessionData.imagen.length > 0)
      this._rutaImagenExistente = this.apiServer.urlSite + this._sessionData.imagen;
    else
      this._rutaImagenExistente = "assets/images/user-avatar.png";

  }


  async onCambiarFotoClick() {
    let dialogRef
    if (this.dialog) {
      dialogRef = this.dialog.open(PopUpFotoComponent, {
        width: '800px',
        disableClose: true,
        data: this.modelo
      });

      dialogRef.componentInstance.imagen.subscribe((res: Usuario) => {
        this.modelo = res;
        this._sessionData.imagen = this.modelo.rutaImagenFrontEnd;
        this._sessionStorageHelperService.SetSessionData(this._sessionData);
        this._rutaImagenExistente = this.apiServer.urlSite + res.rutaImagenFrontEnd;
        
        this.cargarUsuario();
        this._usuario = this.modelo.nombre;

        this._messageHelper.cambioAvatar(true);//Al menos el componente Header está suscrito  
      });
    }
  }

  onCambiarContrasena() {
    this._router.navigate(['/' + AppConfig.routes.CambiarContra]);
  }

  async cargarUsuario() {
    this._sessionData = this._sessionStorageHelperService.GetSessionData();
    this.modelo = this._sessionHelperService.getSessionUser();
    /*if (!this.modelo)
      this.modelo = await this._usuarioLoginService.loginBackgroundUsuario();*/
  }


  onLoggedout() {

    try {
      localStorage.removeItem('isLoggedin');
      this._sessionStorageHelperService.RemoveSessionData();
    } catch (error) {

    }

    this._router.navigate(['/' + AppConfig.routes.login]);
  }
}