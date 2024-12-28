import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from 'app/router.animations';
import { IAppConfig } from 'app/config/iapp.config';
import { AppConfig } from 'app/config/app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumPerfiles, EnumRecursos } from 'app/shared/enums/commonEnums';
import { BaseListPage } from 'app/layout/generalPages/BasePages/BaseListPage';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Usuario } from 'app/models/generalModels/usuario.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.template.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [routerTransition()],
})
export class InicioComponent extends BaseListPage implements OnInit {
  _appConfig: IAppConfig = AppConfig;
  @BlockUI() blockUI: NgBlockUI;


  constructor(
    private _router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _usuarioLoginService: usuarioLoginService,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog

  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Inicio);
  }

  ngOnInit() {

  }
  onSubmit() {
    this._router.navigate([AppConfig.routes.login]);
  }
  verificarSesion() {
    if (this._sessionHelperService.getSessionUser() && this._sessionHelperService.getSessionUser().idPerfil != EnumPerfiles.Publico) {
      return true;
    }
  }



}

