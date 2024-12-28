import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";
import { routerTransition } from "app/router.animations";
import { HerramientaCajaService } from "app/services/generalService/herramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseListPage } from "../BasePages/BaseListPage";

@Component({
    selector: 'app-herramientas-caja',
    templateUrl: './herramienta-caja-listar.component.html',
    animations: [routerTransition()]
})

export class HerramientaCajaListarComponent extends BaseListPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;

    constructor(
        private _router: Router,
        private _adminService: HerramientaCajaService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.HerramientaCaja);
        this.titulo = 'caja de herramientas';

        this._adminService.inicializar(HerramientaCaja, HerramientaCajaListarRespuesta, "HerramientaCaja");

        this.setOrdenInicial('titulo', 'ASC')

        this.fields = [
            {
                name: 'titulo',
                display: 'Título',
                align: 1,
                link: true,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'tipoHerramientaCajaNombre',
                display: 'Tipo',
                align: 1,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'categoriaHerramientaCajaNombre',
                display: 'Categoría',
                align: 1,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'tamanoArchivoEnMB',
                display: 'Tamaño del archivo (MB)',
                align: 1,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'numeroConsultas',
                display: 'Número de consultas',
                align: 2,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'activo',
                display: 'Activo',
                align: 2,
                allowSorting: true,
                formatter: ''
            }

        ];
    }

    async ngOnInit() {
        await this.obtenerPermisos();
        this.getDefaultParams();

        this._puedeCrear = this._recursoPerfil.Crea;
    }

    getFinalFilter(searchValue: string, searchField?: string) {
        if (!searchField)
            searchField = 'titulo';

        return [
            { operadorLogico: "", campoFiltro: searchField, condicional: "like", valor: searchValue }
        ];
    }

    query = async (data: any, searchField?: string, searchValue?: string) => {
        this.blockUI.start();

        let operador: string = '';
        if (searchValue) {
            data.Filtros = this.getFinalFilter(searchField, searchValue);
            operador = 'AND';
        }

        this.currentTransfer = data;

        this.setListState(data, searchValue, searchField);


        let datosRespuesta: HerramientaCajaListarRespuesta;
        try {
            datosRespuesta = await this._adminService.listar(data);

            this.data = datosRespuesta.listHerramientaCajaRespuesta;

            this.pagination = this.parsePaginator(datosRespuesta.paginadorRespuesta);
        }
        catch (e) {
            this.manejoExcepcion(e, '/' + AppConfig.routes.dashboard);
        }
        finally {
            this.blockUI.stop();
        }
    }

    edit = async (reg: any) => {
        this._router.navigate([AppConfig.routes.HerramientaCajaAdmin, reg.idHerramientaCaja]);
    }

    add = async () => {
        this._router.navigate([AppConfig.routes.HerramientaCajaAdmin, 0]);
    }
}