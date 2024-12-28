import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { CategoriaHerramientaCaja } from "app/models/generalModels/categoriaHerramientaCaja.model";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { HerramientaCajaBuscar } from "app/models/generalModels/herramientaCajaBuscar.model";
import { TipoHerramientaCaja } from "app/models/generalModels/tipoHerramientaCaja.model";
import { CategoriaHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";
import { TipoHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/tipoHerramientaCajaListarRespuesta";
import { CategoriaHerramientaCajaService } from "app/services/generalService/categoriaHerramientaCaja.service";
import { HerramientaCajaService } from "app/services/generalService/herramientaCaja.service";
import { tipoHerramientaCajaService } from "app/services/generalService/tipoHerramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseEditPage } from "../../generalPages/BasePages/BaseEditPage";

@Component({
    templateUrl: './consultar-herramienta-caja.component.html',
})

export class ConsultarHerramientaCajaComponent extends BaseEditPage implements OnInit {
    public modelo: HerramientaCajaBuscar;
    public todosCategoria: CategoriaHerramientaCaja;
    public todosTipo: TipoHerramientaCaja;

    public _dataTipoHerramientaCaja: TipoHerramientaCaja[];
    public _dataCategoriaHerramientaCaja: CategoriaHerramientaCaja[];
    public listadoRespuesta: HerramientaCaja[];

    _appConfig: IAppConfig = AppConfig;
    herramientaCajaBuscarForm: FormGroup;

    errors = errorMessages;

    @BlockUI() blockUI: NgBlockUI;

    constructor(private route: ActivatedRoute,
        private router: Router,
        protected _sessionHelperService: SessionHelperService,
        protected _herramientaCajaService: HerramientaCajaService,
        protected _usuarioLoginService: usuarioLoginService,
        protected _tipoHerramientaCajaService: tipoHerramientaCajaService,
        protected _categoriaHerramientaCajaService: CategoriaHerramientaCajaService,
        private formBuilder: FormBuilder,
        public _snackBar: MatSnackBar,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.HerramientaCaja);

        this._recurso = EnumRecursos.HerramientaCaja;
        this._urlRetorno = '/' + AppConfig.routes.HerramientaCaja;
        this._tituloBase = 'buscar en caja de herramientas';

        this._herramientaCajaService.inicializar(HerramientaCaja, HerramientaCajaListarRespuesta, "HerramientaCaja");
        this._tipoHerramientaCajaService.inicializar(TipoHerramientaCaja, TipoHerramientaCajaListarRespuesta, 'TipoHerramientaCaja')
        this._categoriaHerramientaCajaService.inicializar(CategoriaHerramientaCaja, CategoriaHerramientaCajaListarRespuesta, 'CategoriaHerramientaCaja')

        this.modelo = new HerramientaCajaBuscar();

        this.herramientaCajaBuscarForm = this.formBuilder.group({
            idTipoHerramientaCaja: [0, [Validators.required]],
            idCategoriaHerramientaCaja: [0, [Validators.required]],
            palabrasClave: [''],
        });
    }

    async ngOnInit() {
        await this.obtenerPermisos();
        this.blockUI.start();
        try {
            this.configuracionParaIniciar();
            this.herramientaCajaBuscarForm.patchValue(this.modelo);

            this.listadoRespuesta = await this._herramientaCajaService.herramientaCajaBuscar(this.modelo);
            var i = this.listadoRespuesta.length;
            while (i--) {
                if (!this.listadoRespuesta[i].activo) {
                    this.listadoRespuesta.splice(i, 1)
                }
            }
            this.soloLecturaControles();

            this.llenarListas();
        }
        catch (e) {
            this.manejoExcepcion(e, this._urlRetorno);
        }
        finally {
            this.blockUI.stop();
        }
    }

    async onSubmit() {
        try {
            this.blockUI.start();
            if (this.herramientaCajaBuscarForm.valid) {
                this.listadoRespuesta = null;

                Object.assign(this.modelo, this.herramientaCajaBuscarForm.value);
                this.modeloSinCeros();
                this.listadoRespuesta = await this._herramientaCajaService.herramientaCajaBuscar(this.modelo);
                var i = this.listadoRespuesta.length;
                while (i--) {
                    if (!this.listadoRespuesta[i].activo) {
                        this.listadoRespuesta.splice(i, 1)
                    }
                }
                if (this.listadoRespuesta.length == 0) {
                    this.mostrarErrorSnackBar("No se encuentran coincidencias");
                }
            }
        }
        catch (e) {
            this.manejoExcepcion(e, this._urlRetorno);
        }
        finally {
            this.blockUI.stop();
        }
    }

    onChange() {
        this.listadoRespuesta = null;
    }

    //Región métodos

    modeloSinCeros() {
        if (this.modelo.idCategoriaHerramientaCaja == 0) {
            this.modelo.idCategoriaHerramientaCaja = null;
        }
        if (this.modelo.idTipoHerramientaCaja == 0) {
            this.modelo.idTipoHerramientaCaja = null;
        }
    }

    configuracionParaIniciar() {
        this.todosTipo = new TipoHerramientaCaja();
        this.todosCategoria = new CategoriaHerramientaCaja();
        this.todosCategoria.idCategoriaHerramientaCaja = 0;
        this.todosCategoria.nombre = 'Todos';
        this.todosTipo.idTipoHerramientaCaja = 0;
        this.todosTipo.nombre = 'Todos'
    }

    async llenarListas() {
        this.blockUI.start();
        let data = this.getDefaultParams('nombre');
        this._dataCategoriaHerramientaCaja = (await this._categoriaHerramientaCajaService.listar(data)).listCategoriaHerramientaCajaRespuesta;
        this._dataCategoriaHerramientaCaja.unshift(this.todosCategoria);
        data.Filtros = [];
        this._dataTipoHerramientaCaja = (await this._tipoHerramientaCajaService.listar(data)).listTipoHerramientaCajaRespuesta;
        this._dataTipoHerramientaCaja.unshift(this.todosTipo);
        this.blockUI.stop();
    }

    soloLecturaControles() {
        if (this._soloLectura) {
            this.herramientaCajaBuscarForm.controls.idTipoHerramientaCaja.disable();
            this.herramientaCajaBuscarForm.controls.idCategoriaHerramientaCaja.disable();
            this.herramientaCajaBuscarForm.controls.palabrasClaves.disable();
        }
    }
}