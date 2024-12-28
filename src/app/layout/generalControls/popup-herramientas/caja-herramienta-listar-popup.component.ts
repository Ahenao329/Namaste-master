import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { BaseListPage } from "app/layout/generalPages/BasePages/BaseListPage";
import { FilterItem } from "app/models/appModels/filterItem.model";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";
import { herramientaParams } from "app/models/generalModels/transferObjects/herramientaParams.model";
import { routerTransition } from "app/router.animations";
import { CajaHerramientaParamService } from "app/services/generalService/caja-herramienta-param.service";
import { HerramientaCajaService } from "app/services/generalService/herramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumRecursos } from "app/shared/enums/commonEnums";
import { SSException } from "app/shared/exceptions/ssexception";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { CajaHerramientaAdminPopupComponent } from "./caja-herramienta-admin-popup.component";


@Component({
  selector: 'app-caja-herramienta-listar-popup',
  templateUrl: './caja-herramienta-listar-popup.component.html',
  styleUrls: ['./caja-herramienta-listar-popup.component.scss'],
  animations: [routerTransition()]

})
export class CajaHerramientaListarPopupComponent  extends BaseListPage implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input("IdCategoria") IdCategoria: number;

    public _puedeCrear: boolean = false;
    public datas: herramientaParams;
    public param: any;

    constructor(
        private _CajaHerramientaParamService:CajaHerramientaParamService,
        public dialog: MatDialog,
        private _router: Router,
        private _adminService: HerramientaCajaService,
        private _adminService2: HerramientaCajaService,
        protected _sessionHelperService: SessionHelperService,
        protected _usuarioLoginService: usuarioLoginService,
    ) {
        super(_sessionHelperService, _usuarioLoginService, EnumRecursos.HerramientaCaja);
        this.titulo = 'caja de herramientas';

        this._adminService.inicializar(HerramientaCaja, HerramientaCajaListarRespuesta, "HerramientaCaja");
        this.datas = new herramientaParams();
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
            },
            {
                name: 'idCategoriaHerramientaCaja',
                display: 'CategoriaHerramientaCaja',
                align: 2,
                allowSorting: true,
                formatter: ''
            }

        ];
    }

    async ngOnInit() {
let l: number = this.IdCategoria
console.log('🆗🆗👇', l)

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


    query = async (data: any, searchField: string, searchValue?: string) => {
        this.blockUI.start();

        let operador: string = '';
        if (searchValue) {
            data.Filtros = this.getFinalFilter(searchField, searchValue);
            operador = 'AND';
        }

        data.Filtros.push(new FilterItem(operador, 'idCategoriaHerramientaCaja', '=', String(this.IdCategoria)));//Para que no muestre usuarios comodín

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
            this.datas.idCategoriaHerramientaCaja = this.IdCategoria
            this.datas.idTipoHerramientaCaja = reg.idHerramientaCaja
        let dialogRef
        if (this.dialog) {
          dialogRef = this.dialog.open(CajaHerramientaAdminPopupComponent, {
            width: '800px',
            disableClose: true,
            data:this.datas,
            
          });

          dialogRef.afterClosed().subscribe(res => {
            console.log('🤍🤍🤍',res.data)

            this.renderizar(res.data);

          })

         }
        //  this.param = reg.idHerramientaCaja
        //  this._CajaHerramientaParamService.disparadorDeHerramientaParams.emit(this.param)
         }


    add = async () => {
        this.datas.idCategoriaHerramientaCaja = this.IdCategoria
        this.datas.idTipoHerramientaCaja = 0

        let dialogRef
        if (this.dialog) {
          dialogRef = this.dialog.open(CajaHerramientaAdminPopupComponent, {
            width: '800px',
            disableClose: true,
            data:this.datas,
            
          });

          dialogRef.afterClosed().subscribe(res => {
            console.log('🤍🤍🤍',res.data);

            this.renderizar(res.data);
          });
 }

//  this.param = 0
//  this._CajaHerramientaParamService.disparadorDeHerramientaParams.emit(this.param)
}


renderizar(data:boolean){
    if(data){
        window.location.reload();
    }
    console.log('da',data)

}
}