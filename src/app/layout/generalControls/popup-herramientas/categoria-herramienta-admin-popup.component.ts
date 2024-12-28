import { Component, Inject, OnInit } from '@angular/core';
import { BaseListPage } from 'app/layout/generalPages/BasePages/BaseListPage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppConfig, AppConfigDin } from 'app/config/app.config';
import { IAppConfig } from 'app/config/iapp.config';
import { BaseEditPage } from 'app/layout/generalPages/BasePages/BaseEditPage';
import { CategoriaHerramientaCaja } from 'app/models/generalModels/categoriaHerramientaCaja.model';
import { CategoriaHerramientaCajaListarRespuesta } from 'app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model';
import { CategoriaHerramientaCajaService } from 'app/services/generalService/categoriaHerramientaCaja.service';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';
import { EnumRecursos } from 'app/shared/enums/commonEnums';
import { Messages } from 'app/shared/Messages/Messages';
import { errorMessages } from 'app/Util/Validaciones.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-categoria-herramienta-admin-popup',
  templateUrl: './categoria-herramienta-admin-popup.component.html',
  styleUrls: ['./categoria-herramienta-admin-popup.component.scss']
})
export class CategoriaHerramientaAdminPopupComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public MostrarCajaHerramientas: boolean;
  public modelo: CategoriaHerramientaCaja;
  public caja: boolean;
  public IdCategoria: number;
  _appConfig: IAppConfig = AppConfig;
  categoriaHerramientaCajaForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _categoriaHerramientaCajaService: CategoriaHerramientaCajaService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.CategoriaHerramientaCaja);

    this._recurso = EnumRecursos.CategoriaHerramientaCaja;
    this._urlRetorno = '/' + AppConfig.routes.CategoriaHerramientaListarPopupComponent;
    this._tituloBase = 'categoría de herramienta popup';

    this._categoriaHerramientaCajaService.inicializar(CategoriaHerramientaCaja, CategoriaHerramientaCajaListarRespuesta, "CategoriaHerramientaCaja");

    this.modelo = new CategoriaHerramientaCaja();

    this.categoriaHerramientaCajaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      activo: [true, [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.obtenerPermisos();
    this.blockUI.start();

    let id: string;
    this.route.params.forEach((params: Params) => {
      id = params['id'];

    });


    
    try {
      let ids: number = Number(id)
      if(ids != 0){
  
        this.MostrarCajaHerramientas = true
      }
      this.parametro = this.prepararIdNumero(id, this._urlRetorno);

      if (this.parametro != 0) {
        this.modelo = await this._categoriaHerramientaCajaService.buscar(this.parametro);
        this.categoriaHerramientaCajaForm.patchValue(this.modelo);
        this.IdCategoria = this.modelo.idCategoriaHerramientaCaja
        console.log('🆗🆗🔴', this.IdCategoria)
        if (this.modelo.activo != null && this.modelo.activo)
          this.categoriaHerramientaCajaForm.controls.activo.setValue(true);
        else if (this.modelo.activo != null)
          this.categoriaHerramientaCajaForm.controls.activo.setValue(false);

        this.soloLecturaControles();
      }
    }
    catch (e) {
      this.manejoExcepcion(e, this._urlRetorno);
    }
    finally {
      this.blockUI.stop();
    }
  }




  async onSubmit() {
    let resultado: boolean;
    this.marcarControlesParaValidacion(this.categoriaHerramientaCajaForm);
    Object.assign(this.modelo, this.categoriaHerramientaCajaForm.value);
    if (this.categoriaHerramientaCajaForm.valid) {
      try {
        this.blockUI.start();

        this.modelo.activo = this.categoriaHerramientaCajaForm.controls.activo.value;

        if (this.parametro == 0) {
          this.modelo = await this._categoriaHerramientaCajaService.crear(this.modelo);
        } else {
          resultado = await this._categoriaHerramientaCajaService.modificar(this.modelo);
          this.caja = true;

        }
        this.router.navigate([this._urlRetorno]);
      }
      catch (e) {
        this.manejoExcepcion(e);
      }
      finally {
        this.blockUI.stop();
      }
    }
  }
  async onDelete() {
    if (!confirm(Messages.val.Eliminar)) {
      return;
    }

    try {
      this.blockUI.start();

      await this._categoriaHerramientaCajaService.eliminar(this.parametro);

      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  soloLecturaControles() {
    if (this._soloLectura) {
      this.categoriaHerramientaCajaForm.controls.nombre.disable();
      this.categoriaHerramientaCajaForm.controls.activo.disable();
    }
    
  //   if (this.parametro != 0) {
  //     this.categoriaHerramientaCajaForm.controls.nombre.disable();
  // }
  }

  }


