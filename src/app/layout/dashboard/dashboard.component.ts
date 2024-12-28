import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui'
import { BaseEditPage } from '../generalPages/BasePages/BaseEditPage';
import { SessionHelperService } from '../../services/helpers/sessionHelper.service';
import { usuarioLoginService } from '../../services/generalService/usuarioLogin.service';
import { EnumRecursos } from '../../shared/enums/commonEnums';
import { AppConfig } from '../../config/app.config';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()],
  providers: []

})
export class DashboardComponent extends BaseEditPage implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public dialog: MatDialog

  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Desktop);
    this._recurso = EnumRecursos.Desktop;
    this._urlRetorno = '/' + AppConfig.routes.login;
    this._tituloBase = 'Inicio';
  }

  async ngOnInit() {
    this.blockUI.start();
    try {
      await this.obtenerPermisos();


    } catch (error) {
    }
    finally {
      this.blockUI.stop();
    }
  }
}
