import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { Area } from "app/models/generalModels/area.model";
import { AreaListarRespuesta } from "app/models/generalModels/transferObjects/areaListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { AreaService } from "app/services/generalService/area.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseListPage } from "../BasePages/BaseListPage";

@Component({
    templateUrl: './area-listar.component.html',
    animations: [routerTransition()]
})

export class AreaListarComponent extends BaseListPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;

    constructor(
        private _router: Router,
        private _adminService: AreaService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.Area);
        this.titulo = 'Áreas';

        this._adminService.inicializar(Area, AreaListarRespuesta, "Area");

        this.setOrdenInicial('nombre', 'ASC')

        this.fields = [
            {
                name: 'nombre',
                display: 'Nombre',
                align: 1,
                link: true,
                allowSorting: true,
                formatter: ''
            },
            {
                name: 'descripcion',
                display: 'Descripción',
                align: 1,
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
            searchField = 'nombre';

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

        let datosRespuesta: AreaListarRespuesta;
        try {
            datosRespuesta = await this._adminService.listar(data);

            this.data = datosRespuesta.listAreaRespuesta;
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
        this._router.navigate([AppConfig.routes.AreaAdmin, reg.idArea]);
    }

    add = async () => {
        this._router.navigate([AppConfig.routes.AreaAdmin, 0]);
    }
}