import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { BaseListPage } from "app/layout/generalPages/BasePages/BaseListPage";
import { CategoriaHerramientaCaja } from "app/models/generalModels/categoriaHerramientaCaja.model";
import { CategoriaHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model";
import { routerTransition } from "app/router.animations";
import { CategoriaHerramientaCajaService } from "app/services/generalService/categoriaHerramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: 'app-categoria-herramienta-listar-popup',
  templateUrl: './categoria-herramienta-listar-popup.component.html',
  styleUrls: ['./categoria-herramienta-listar-popup.component.scss'],
  animations: [routerTransition()]

})
export class CategoriaHerramientaListarPopupComponent extends BaseListPage  implements OnInit {

@BlockUI() blockUI: NgBlockUI;
    public _puedeCrear: boolean = false;
    param: string;

    constructor(  
        private _router: Router,
        private _adminService: CategoriaHerramientaCajaService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.CategoriaHerramientaCaja);
        this.titulo = 'categorías de herramienta popup';

        this._adminService.inicializar(CategoriaHerramientaCaja, CategoriaHerramientaCajaListarRespuesta, "CategoriaHerramientaCaja");

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
                name: 'activo',
                display: 'Activo',
                align: 2,
                allowSorting: true,
                formatter: ''
            }
        ];
    }

    async ngOnInit() {
        // this.fields.Filtros = this.getFinalFilter(searchField, searchValue);

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
            operador = 'AND';
        }

        this.currentTransfer = data;

        this.setListState(data, searchValue, searchField);


        let datosRespuesta: CategoriaHerramientaCajaListarRespuesta;
        try {
            datosRespuesta = await this._adminService.listar(data);

            this.data = datosRespuesta.listCategoriaHerramientaCajaRespuesta;

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
    this._router.navigate([AppConfig.routes.CategoriaHerramientaAdminPopupComponent, reg.idCategoriaHerramientaCaja]);
}

add = async () => {
    this._router.navigate([AppConfig.routes.CategoriaHerramientaAdminPopupComponent, 0]);
}

}
