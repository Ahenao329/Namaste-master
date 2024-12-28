import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppConfig } from '../config/app.config';
import { UsuarioListarComponent } from './generalPages/usuarios/usuario-listar.component';
import { UsuarioAdminComponent } from './generalPages/usuarios/usuario-admin.component';
import { CambiarContrasenaComponent } from './generalPages/cambiarContrasena/cambiarContrasena.component';
import { ParametroFuncionalListarComponent } from './generalPages/parametro-funcional/parametroFuncional-listar.component';
import { ParametroFuncionalAdminComponent } from './generalPages/parametro-funcional/parametroFuncional-admin.component';
import { ParametroHTMLListarComponent } from './generalPages/parametro-html/parametro-html-listar.component';
import { ParametroHTMLAdminComponent } from './generalPages/parametro-html/parametro-html-admin.component';
import { CargoListarComponent } from './generalPages/cargo/cargo-listar.component';
import { CargoAdminComponent } from './generalPages/cargo/cargo-admin.component';
import { AreaListarComponent } from './generalPages/area/area-listar.component';
import { AreaAdminComponent } from './generalPages/area/area-admin.component';
import { DiaFestivoListarComponent } from './generalPages/dia-festivo/dia-festivo-listar.component';
import { DiaFestivoAdminComponent } from './generalPages/dia-festivo/dia-festivo-admin.component';
import { MaterialAdicionalCorreoListarComponent } from './generalPages/material-adicional-correo/material-adicional-correo-listar.component';
import { MaterialAdicionalCorreoAdminComponent } from './generalPages/material-adicional-correo/material-adicional-correo-admin.component';
import { ReporteDistribucion } from './reportPages/reporte-distribucion/reporte-distribucion.component';
import { ReporteHistograma } from './reportPages/reporte-histograma/reporte-histograma.component';
import { CategoriaHerramientaCajaListarComponent } from './generalPages/categoria-herramienta-caja/categoria-herramienta-caja-listar.component';
import { CategoriaHerramientaCajaAdminComponent } from './generalPages/categoria-herramienta-caja/categoria-herramienta-caja-admin.component';
import { HerramientaCajaListarComponent } from './generalPages/herramienta-caja/herramienta-caja-listar.component';
import { HerramientaCajaAdminComponent } from './generalPages/herramienta-caja/herramienta-caja-admin.component';
import { ConsultarHerramientaCajaComponent } from './businessPages/consultar-herramienta-caja/consultar-herramienta-caja.component';
import { BotonPanicoListarComponent } from './businessPages/boton-panico/boton-panico-listar.component';
import { BotonPanicoAdminComponent } from './businessPages/boton-panico/boton-panico-admin.component';
import { TipoEmocionListarComponent } from './generalPages/tipo-emocion/tipo-emocion-listar.component';
import { TipoEmocionAdminComponent } from './generalPages/tipo-emocion/tipo-emocion-admin.component';
import { CategoriaHerramientaAdminPopupComponent } from './generalControls/popup-herramientas/categoria-herramienta-admin-popup.component';
import { CajaHerramientaListarPopupComponent } from './generalControls/popup-herramientas/caja-herramienta-listar-popup.component';
import { CategoriaHerramientaListarPopupComponent } from './generalControls/popup-herramientas/categoria-herramienta-listar-popup.component';
import { CajaHerramientaAdminPopupComponent } from './generalControls/popup-herramientas/caja-herramienta-admin-popup.component';


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: AppConfig.routes.dashboard },

            { path: AppConfig.routes.dashboard, component: DashboardComponent },

            { path: AppConfig.routes.dashboardPrivado, component: DashboardComponent },

            { path: AppConfig.routes.Usuarios, component: UsuarioListarComponent },
            { path: AppConfig.routes.UsuariosAdmin + '/:id', component: UsuarioAdminComponent },
            { path: AppConfig.routes.UsuariosAdmin + '/:id/:id1', component: UsuarioAdminComponent },//En caso de crear desde registro de docente, id1 es idRegisroDocente
            { path: AppConfig.routes.CambiarContra, component: CambiarContrasenaComponent },
            { path: AppConfig.routes.ParametrosFuncionales, component: ParametroFuncionalListarComponent },
            { path: AppConfig.routes.ParametrosFuncionalesAdmin + '/:id', component: ParametroFuncionalAdminComponent },
            { path: AppConfig.routes.ParametrosHTML, component: ParametroHTMLListarComponent },
            { path: AppConfig.routes.ParametrosHTMLAdmin + '/:id', component: ParametroHTMLAdminComponent },
            { path: AppConfig.routes.Cargos, component: CargoListarComponent },
            { path: AppConfig.routes.CargoAdmin + '/:id', component: CargoAdminComponent },
            { path: AppConfig.routes.Area, component: AreaListarComponent },
            { path: AppConfig.routes.AreaAdmin + '/:id', component: AreaAdminComponent },
            { path: AppConfig.routes.DiaFestivo, component: DiaFestivoListarComponent },
            { path: AppConfig.routes.DiaFestivoAdmin + '/:id', component: DiaFestivoAdminComponent },
            { path: AppConfig.routes.MaterialAdicionalCorreo, component: MaterialAdicionalCorreoListarComponent },
            { path: AppConfig.routes.MaterialAdicionalCorreoAdmin + '/:id', component: MaterialAdicionalCorreoAdminComponent },
            { path: AppConfig.routes.CategoriaHerramientaCaja, component: CategoriaHerramientaCajaListarComponent },
            { path: AppConfig.routes.CategoriaHerramientaCajaAdmin + '/:id', component: CategoriaHerramientaCajaAdminComponent },
            { path: AppConfig.routes.HerramientaCaja, component: HerramientaCajaListarComponent },
            { path: AppConfig.routes.HerramientaCajaAdmin + '/:id', component: HerramientaCajaAdminComponent },
            { path: AppConfig.routes.HerramientaCajaBuscar, component: ConsultarHerramientaCajaComponent },
            { path: AppConfig.routes.TipoEmocion, component: TipoEmocionListarComponent },
            { path: AppConfig.routes.TipoEmocionAdmin + '/:id', component: TipoEmocionAdminComponent },
            { path: AppConfig.routes.CategoriaHerramientaAdminPopupComponent + '/:id', component: CategoriaHerramientaAdminPopupComponent},
            { path: AppConfig.routes.CategoriaHerramientaListarPopupComponent, component: CategoriaHerramientaListarPopupComponent },
            { path: AppConfig.routes.CajaHerramientaListarPopupComponent, component	: CajaHerramientaListarPopupComponent},
            { path: AppConfig.routes.CajaHerramientaAdminPopupComponent + '/:id', component	: CajaHerramientaAdminPopupComponent},
            
            //Negocio
            { path: AppConfig.routes.BotonPanico, component: BotonPanicoListarComponent },
            { path: AppConfig.routes.BotonPanicoAdmin + '/:id', component: BotonPanicoAdminComponent },


            //Reportes
            { path: AppConfig.routes.ReporteDistribucion, component: ReporteDistribucion },
            { path: AppConfig.routes.ReporteHistograma, component: ReporteHistograma },
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
