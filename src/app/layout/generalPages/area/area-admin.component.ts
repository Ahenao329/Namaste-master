import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { Area } from "app/models/generalModels/area.model";
import { AreaListarRespuesta } from "app/models/generalModels/transferObjects/areaListarRespuesta.model";
import { AreaService } from "app/services/generalService/area.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../BasePages/BaseEditPage";

@Component({
  selector: 'area-admin',
  templateUrl: './area-admin.component.html',
})

export class AreaAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: Area;

  _appConfig: IAppConfig = AppConfig;
  areaForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _areaService: AreaService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Area);

    this._recurso = EnumRecursos.Area;
    this._urlRetorno = '/' + AppConfig.routes.Area;
    this._tituloBase = 'área';

    this._areaService.inicializar(Area, AreaListarRespuesta, "Area");

    this.modelo = new Area();

    this.areaForm = this.formBuilder.group({
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
        this.modelo = await this._areaService.buscar(this.parametro);
        this.areaForm.patchValue(this.modelo);

        if (this.modelo.activo != null && this.modelo.activo)
          this.areaForm.controls.activo.setValue(true);
        else if (this.modelo.activo != null)
          this.areaForm.controls.activo.setValue(false);

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
    this.marcarControlesParaValidacion(this.areaForm);
    Object.assign(this.modelo, this.areaForm.value);
    if (this.areaForm.valid) {
      try {
        this.blockUI.start();

        this.modelo.activo = this.areaForm.controls.activo.value;

        if (this.parametro == 0) {
          this.modelo = await this._areaService.crear(this.modelo);
        } else {
          resultado = await this._areaService.modificar(this.modelo);
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

      await this._areaService.eliminar(this.parametro);

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
      this.areaForm.controls.nombre.disable();
      this.areaForm.controls.descripcion.disable();
      this.areaForm.controls.activo.disable();
    }
  }
}