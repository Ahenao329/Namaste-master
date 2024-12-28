import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { Cargo } from "app/models/generalModels/cargo.model";
import { CargoListarRespuesta } from "app/models/generalModels/transferObjects/cargoListarRespuesta.model";
import { CargoService } from "app/services/generalService/cargo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages, regExps } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../BasePages/BaseEditPage";

@Component({
  templateUrl: './cargo-admin.component.html',
})

export class CargoAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: Cargo;

  _appConfig: IAppConfig = AppConfig;
  cargoForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _cargoService: CargoService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Cargo);

    this._recurso = EnumRecursos.Cargo;
    this._urlRetorno = '/' + AppConfig.routes.Cargos;
    this._tituloBase = 'cargo/profesión';

    this._cargoService.inicializar(Cargo, CargoListarRespuesta, "Cargo");

    this.modelo = new Cargo();

    this.cargoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
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
        this.modelo = await this._cargoService.buscar(this.parametro);
        this.cargoForm.patchValue(this.modelo);

        if (this.modelo.activo != null && this.modelo.activo)
          this.cargoForm.controls.activo.setValue(true);
        else if (this.modelo.activo != null)
          this.cargoForm.controls.activo.setValue(false);

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
    this.marcarControlesParaValidacion(this.cargoForm);
    Object.assign(this.modelo, this.cargoForm.value);
    if (this.cargoForm.valid) {
      try {
        this.blockUI.start();

        this.modelo.activo = this.cargoForm.controls.activo.value;

        if (this.parametro == 0) {
          this.modelo = await this._cargoService.crear(this.modelo);
        } else {
          resultado = await this._cargoService.modificar(this.modelo);
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

      await this._cargoService.eliminar(this.parametro);

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
      this.cargoForm.controls.nombre.disable();
      this.cargoForm.controls.descripcion.disable();
      this.cargoForm.controls.activo.disable();
    }
  }
}