import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { CategoriaHerramientaCaja } from "app/models/generalModels/categoriaHerramientaCaja.model";
import { CategoriaHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model";
import { CategoriaHerramientaCajaService } from "app/services/generalService/categoriaHerramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../BasePages/BaseEditPage";

@Component({
  selector: 'app-categoria-herramientas-admin',
  templateUrl: './categoria-herramienta-caja-admin.component.html',
})

export class CategoriaHerramientaCajaAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: CategoriaHerramientaCaja;
  public caja: boolean;

  _appConfig: IAppConfig = AppConfig;
  categoriaHerramientaCajaForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _categoriaHerramientaCajaService: CategoriaHerramientaCajaService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.CategoriaHerramientaCaja);

    this._recurso = EnumRecursos.CategoriaHerramientaCaja;
    this._urlRetorno = '/' + AppConfig.routes.CategoriaHerramientaCaja;
    this._tituloBase = 'categoría de herramienta';

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
      this.parametro = this.prepararIdNumero(id, this._urlRetorno);
      if (this.parametro != 0) {
        this.modelo = await this._categoriaHerramientaCajaService.buscar(this.parametro);
        this.categoriaHerramientaCajaForm.patchValue(this.modelo);

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
  }
}