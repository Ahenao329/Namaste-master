import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig } from '../config/app.config';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/modules/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NumberOnlyDirective } from "../Util/NumbersOnly.directive";
import { UsuarioListarComponent } from './generalPages/usuarios/usuario-listar.component';
import { UsuarioAdminComponent } from './generalPages/usuarios/usuario-admin.component';
import { CambiarContrasenaComponent } from './generalPages/cambiarContrasena/cambiarContrasena.component';
import { ParametroFuncionalListarComponent } from './generalPages/parametro-funcional/parametroFuncional-listar.component';
import { ParametroFuncionalAdminComponent } from './generalPages/parametro-funcional/parametroFuncional-admin.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ParametroHTMLListarComponent } from './generalPages/parametro-html/parametro-html-listar.component';
import { ParametroHTMLAdminComponent } from './generalPages/parametro-html/parametro-html-admin.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicLayoutComponent } from './public-layout.component';
import { LayoutPrintComponent } from 'app/public/layout-print.component';
import { CargoListarComponent } from './generalPages/cargo/cargo-listar.component';
import { CargoAdminComponent } from './generalPages/cargo/cargo-admin.component';
import { AreaListarComponent } from './generalPages/area/area-listar.component';
import { AreaAdminComponent } from './generalPages/area/area-admin.component';
import { DiaFestivoListarComponent } from './generalPages/dia-festivo/dia-festivo-listar.component';
import { DiaFestivoAdminComponent } from './generalPages/dia-festivo/dia-festivo-admin.component';
import { MaterialAdicionalCorreoListarComponent } from './generalPages/material-adicional-correo/material-adicional-correo-listar.component';
import { MaterialAdicionalCorreoAdminComponent } from './generalPages/material-adicional-correo/material-adicional-correo-admin.component';
import { ChartsModule } from 'ng2-charts';
import { ReporteDistribucion } from './reportPages/reporte-distribucion/reporte-distribucion.component';
import { ReporteHistograma } from './reportPages/reporte-histograma/reporte-histograma.component';
import { CategoriaHerramientaCajaListarComponent } from './generalPages/categoria-herramienta-caja/categoria-herramienta-caja-listar.component';
import { CategoriaHerramientaCajaAdminComponent } from './generalPages/categoria-herramienta-caja/categoria-herramienta-caja-admin.component';
import { HerramientaCajaListarComponent } from './generalPages/herramienta-caja/herramienta-caja-listar.component';
import { HerramientaCajaAdminComponent } from './generalPages/herramienta-caja/herramienta-caja-admin.component';
import { ConsultarHerramientaCajaComponent } from './businessPages/consultar-herramienta-caja/consultar-herramienta-caja.component';
import { HerramientaCajaVisualizarItemControl } from './businessPages/consultar-herramienta-caja/consultar-herramienta-caja-item-control.component';
import { ReporteHistogramaItemControl } from './reportPages/reporte-histograma/reporte-histograma-item-control.component';
import { BotonPanicoListarComponent } from './businessPages/boton-panico/boton-panico-listar.component';
import { BotonPanicoAdminComponent } from './businessPages/boton-panico/boton-panico-admin.component';
import { TipoEmocionListarComponent } from './generalPages/tipo-emocion/tipo-emocion-listar.component';
import { TipoEmocionAdminComponent } from './generalPages/tipo-emocion/tipo-emocion-admin.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';



@NgModule({
    imports: [
        NgxMatColorPickerModule,
        CommonModule,
        
        LayoutRoutingModule,

        TranslateModule,
        SharedModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatSnackBarModule,
        MatCardModule,
        AngularMyDatePickerModule,
        AngularEditorModule,

        ChartsModule

    ],

    declarations: [
        LayoutComponent,
        PublicLayoutComponent,
        LayoutPrintComponent,

        SidebarComponent,
        HeaderComponent,
        RightSidebarComponent,
        NumberOnlyDirective,

        DashboardComponent,
        UsuarioListarComponent,
        UsuarioAdminComponent,
        ParametroFuncionalListarComponent,
        ParametroFuncionalAdminComponent,
        CambiarContrasenaComponent,
        ParametroHTMLListarComponent,
        ParametroHTMLAdminComponent,
        CargoListarComponent,
        CargoAdminComponent,
        AreaListarComponent,
        AreaAdminComponent,
        DiaFestivoListarComponent,
        DiaFestivoAdminComponent,
        MaterialAdicionalCorreoListarComponent,
        MaterialAdicionalCorreoAdminComponent,
        CategoriaHerramientaCajaListarComponent,
        CategoriaHerramientaCajaAdminComponent,
        HerramientaCajaListarComponent,
        HerramientaCajaAdminComponent,
        ConsultarHerramientaCajaComponent,
        HerramientaCajaVisualizarItemControl,
        ReporteHistogramaItemControl,
        BotonPanicoListarComponent,
        BotonPanicoAdminComponent,
        TipoEmocionListarComponent,
        TipoEmocionAdminComponent,




        //Negocio

        //Reportes
        ReporteHistograma,
        ReporteDistribucion,

    ],
    providers: [
        { provide: APP_CONFIG, useValue: AppConfig },
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
        { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }


    ],

})
export class LayoutModule { }
