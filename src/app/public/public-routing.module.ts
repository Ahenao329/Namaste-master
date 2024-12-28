import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConfig } from '../config/app.config';
import { InicioComponent } from 'app/public/inicio/inicio.component';
import { PublicLayoutComponent } from 'app/layout/public-layout.component';
import { LayoutPrintComponent } from './layout-print.component';
import { RegistroDiarioEmocion } from 'app/models/businessModels/registroDiarioEmocion.model';
import { RegistroDiarioEmocionAdminComponent } from './registro-diario-emocion/registro-diario-emocion-admin.component';

const routes: Routes = [
    { path: '', redirectTo: AppConfig.routes.Inicio, pathMatch: 'full' },

    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: AppConfig.routes.Inicio, component: InicioComponent },            
            { path: AppConfig.routes.RegistroDiarioEmocion + '/:token/:idTipoEmocion', component: RegistroDiarioEmocionAdminComponent },
          
        ]
    },
    /*{
        path: "",
        component: LayoutPrintComponent,
        children: [
            {
                path: AppConfig.routes.ExportarPdfExperiencia + "/:id", component: ExperienciaExportarPDFComponent
            }
        ]
    }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule { }
