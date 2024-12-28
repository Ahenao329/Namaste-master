
import { SSException } from '../../../shared/exceptions/ssexception';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { popupAlertDialogComponent, EnumTipoAlerta } from '../../generalControls/PopUpAlert/popUpAlert.component';
import { RecursosPerfil } from '../../../models/appModels/recursosPerfil';
import { EnumRecursos } from '../../../shared/enums/commonEnums';
import { SessionHelperService } from '../../../services/helpers/sessionHelper.service';
import { usuarioLoginService } from '../../../services/generalService/usuarioLogin.service';
import { AppConfig } from '../../../config/app.config';
import { PopUpConfirmData } from '../../../models/appModels/popupConfirm.model';
import { popupConfirmDialogComponent } from '../../generalControls/PopUpConfirm/popUpConfirm.component';
import { PopUpShowInfoData } from '../../../models/appModels/popupShowInfo.model';
import { popupShowInfoDialogComponent } from '../../generalControls/PopUpShowInfo/popUpShowInfo.component';
import { ManejoErrorPopUp } from '../../../models/appModels/manejoErrorPopUp.model';
import { SessionStorageHelperService } from 'app/services/helpers/sessionStorageHelper.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarCustomComponent } from 'app/layout/generalControls/snack-bar-custom/snack-bar-custom.component';

export class BaseCorePage {
  public titulo: string;

  public parametro: number;
  public _recurso: EnumRecursos;
  public _recursoEstado: EnumRecursos = EnumRecursos.SinEspecificar;//Se usa para página de listado de segundo nivel de profundidad
  public _recursoPerfil: RecursosPerfil;

  public _urlRetorno: string = AppConfig.routes.dashboard;

  //Permisos
  public _puedeCrear: boolean = false;
  public _puedeModificar: boolean = false;
  public _puedeEliminar: boolean = false;

  /*Inicio popup */
  public dialog: MatDialog;
  /**titulo para el popup */
  public _TituloPopup: string;
  /**Descripciòn para el popup */
  public _DescripcionPopup: string;
  /**Tiempo para cerrace el popup en segundos */
  public _TimerPopUpAlert: number;
  /**Ruta en caso de que el popup redireccione a otra pagina */
  public _RutaPopUpAlert: string;
  /**Enumeracion de tipo de alerta -- Confirmacion, */
  public _TipoAlert: EnumTipoAlerta;
  /**DisableClose: true or false -- Esto bloquea el popup para que solo cirre desde un boton.*/
  public _DisableClose: boolean;

  /*fin popup */

  public _snackBar: MatSnackBar;

  ValidarFormControl = new FormControl('', [
    Validators.required
  ]);
  constructor(protected _sessionHelperService: SessionHelperService
    , protected _usuarioLoginService: usuarioLoginService
    , protected _recursoIni: EnumRecursos) {
    this.parametro = 0;
    this._TituloPopup = 'Confirmado';
    this._DescripcionPopup = 'Operación completa.';
    this._TimerPopUpAlert = 2;
    this._RutaPopUpAlert = "";
    this._TipoAlert = EnumTipoAlerta.Confirmacion;
    this._DisableClose = true;
    this._recurso = _recursoIni;
  }

  openDialog(): void {
    if (this.dialog) {
      let dialogRef = this.dialog.open(popupAlertDialogComponent, {
        width: '550px',
        disableClose: this._DisableClose,
        data: { Titulo: this._TituloPopup, Descripcion: this._DescripcionPopup, Timer: this._TimerPopUpAlert, Ruta: this._RutaPopUpAlert, TipoAlert: this._TipoAlert }
      });
    }
  }

  async openConfirmDialog(dataIn: PopUpConfirmData, ancho: number = 500): Promise<boolean> {
    let retorno: boolean = false;
    let dialogRef
    if (this.dialog) {
      dialogRef = this.dialog.open(popupConfirmDialogComponent, {
        width: ancho.toString() + 'px',
        disableClose: dataIn.closeDesactivado,
        data: dataIn
      });
      await dialogRef.afterClosed().toPromise().then(res => {
        retorno = res;
      });
    }
    return retorno;
  }

  manejoExcepcion(ex, ruta?: string) {
    this._TituloPopup = 'Error';
    this._TipoAlert = EnumTipoAlerta.Error;
    var error1
    if (ex instanceof SSException) {
      error1 = <SSException>ex;
      this._DescripcionPopup = error1.message;
    }
    else {
      //TODO:Completar manejo excepcion
      error1 = <Error>ex;
      this._DescripcionPopup = error1.message;
    }

    if (ruta)
      this._RutaPopUpAlert = ruta;

    this._TimerPopUpAlert = 5;
    this.openDialog();
  }

  manejoExcepcionPopUp(ex): ManejoErrorPopUp {
    let mensage: string = 'Error general';
    let numeroError: number = 0;

    var error1
    if (ex instanceof SSException) {
      error1 = <SSException>ex;
      mensage = error1.message;
      numeroError = error1.id;
    }
    else {
      //TODO:Completar manejo excepcion
      error1 = <Error>ex;
      mensage = error1.message;
    }

    return new ManejoErrorPopUp(numeroError, mensage);
  }

  async manejoExcepcionLocal(e, tiempoEnMs: number = 8000) {
    if (this._snackBar) {
      let exResult: ManejoErrorPopUp = this.manejoExcepcionPopUp(e);

      let config = new MatSnackBarConfig();
      config.duration = tiempoEnMs;
      config.panelClass = ['snackbar-error']

      this._snackBar.open(exResult.Mensaje, "Cerrar", config);
    }
    else
      console.error('No se instanció el snackBar desde la clase hija');
  }

  async mostrarInformacionSnackBar(mensaje, tiempoEnMs: number = 4000) {
    if (this._snackBar) {
      let config = new MatSnackBarConfig();
      config.duration = tiempoEnMs;
      config.panelClass = ['snackbar-info']

      this._snackBar.open(mensaje, "Cerrar", config);
    }
    else
      console.error('No se instanció el snackBar desde la clase hija');
  }

  async mostrarErrorSnackBar(mensaje, tiempoEnMs: number = 8000) {
    if (this._snackBar) {
      let config = new MatSnackBarConfig();
      config.duration = tiempoEnMs;
      config.panelClass = ['snackbar-error'];
      config.data = mensaje;

      //this._snackBar.openFromTemplate(mensaje, "Cerrar", config);
      this._snackBar.openFromComponent(SnackBarCustomComponent, config);
    }
    else
      console.error('No se instanció el snackBar desde la clase hija');
  }

  async obtenerPermisos() {

    if (!this._sessionHelperService.existeSesion())
      await this._usuarioLoginService.loginBackground();

    this._recursoPerfil = this._sessionHelperService.getPermisosRecurso(this._recurso);

    this._puedeCrear = this._recursoPerfil.Crea;
    this._puedeEliminar = this._recursoPerfil.Elimina;
    this._puedeModificar = this._recursoPerfil.Modifica;
    if (!this._recursoPerfil.Consulta) {
      if (this._recurso == EnumRecursos.Desktop) {
        let sessionStorageHelperService: SessionStorageHelperService = new SessionStorageHelperService();
        sessionStorageHelperService.SetSessionData(null); //Para evitar bucle 
      }
      this.lanzarExcepcionPermisos();
    }
  }

  lanzarExcepcionPermisos() {
    this._urlRetorno = AppConfig.routes.login;
    let ex: SSException = new SSException("No tiene privilegios para realizar esta acción.");
    ex.fillParams(-1);
    this.manejoExcepcion(ex, this._urlRetorno);
  }

  clearListState() {
    this._sessionHelperService.listState = null;
  }

  //Específico CARRIEL
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Para que muestres mensajes de los errores de validación.
  marcarControlesParaValidacion(userForm: FormGroup) {
    try {
      (<any>Object).values(userForm.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
      });
    } catch (error) {
    }
  }

  /*async openAyudaPopUp(dataIn: PopUpShowInfoData) {

    let temp: string = "";
    let dialogRef;

    if (this.dialog) {
      dialogRef = this.dialog.open(popupShowInfoDialogComponent, {
        width: '650px',
        minWidth: '500px',
        maxHeight: '700px',
        disableClose: false,
        data: dataIn
      });
    }
  }*/

}
