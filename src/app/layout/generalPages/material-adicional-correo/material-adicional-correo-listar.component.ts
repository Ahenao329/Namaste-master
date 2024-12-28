import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { MaterialAdicionalCorreo } from "app/models/generalModels/materia-adicional-correo.model";
import { MaterialAdicionalCorreoListarRespuesta } from "app/models/generalModels/transferObjects/materialAdicionalCorreoListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { MaterialAdicionalCorreoService } from "app/services/generalService/materialAdicionalCorreo.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BaseListPage } from "../BasePages/BaseListPage";

@Component({
    templateUrl: './material-adicional-correo-listar.component.html',
    animations: [routerTransition()]
})

export class MaterialAdicionalCorreoListarComponent extends BaseListPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;

    constructor(
        private _router: Router,
        private _adminService: MaterialAdicionalCorreoService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.MaterialAdicionalCorreo);
        this.titulo = 'Material adicional correo';

        this._adminService.inicializar(MaterialAdicionalCorreo, MaterialAdicionalCorreoListarRespuesta, "MaterialAdicionalCorreo");

        this.setOrdenInicial('fecha', 'ASC')

        this.fields = [
            {
                name: 'fecha',
                display: 'Fecha',
                align: 1,
                link: true,
                allowSorting: false,
                formatter: this._sessionHelperService.FormatoFecha,
                pipe: new DatePipe(this._sessionHelperService.sessionGlobal),
            },
        ];
    }

    async ngOnInit() {
        await this.obtenerPermisos();
        this.getDefaultParams();

        this._puedeCrear = this._recursoPerfil.Crea;
    }

    getFinalFilter(searchValue: string, searchField?: string) {
        if (!searchField)
            searchField = 'fecha';

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


        let datosRespuesta: MaterialAdicionalCorreoListarRespuesta;
        try {
            datosRespuesta = await this._adminService.listar(data);

            this.data = datosRespuesta.listMaterialAdicionalCorreoRespuesta;

            for (let index = 0; index < this.data.length; index++) {
                this.data[index].fecha = new Date(this.data[index].fecha).toDateString();
            }

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
        this._router.navigate([AppConfig.routes.MaterialAdicionalCorreoAdmin, reg.idMaterialAdicionalCorreo]);
    }

    add = async () => {
        this._router.navigate([AppConfig.routes.MaterialAdicionalCorreoAdmin, 0]);
    }
}