import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AngularMyDatePickerModule } from "angular-mydatepicker";
import { MaterialModule } from "app/shared/modules/material.module";
import { GeneralControlsModule } from "../generalControls/generalControls.module";
import { FiltroReporteControl } from "./filtro-reporte-control/filtro-reporte-control.component";
import { GraficaLineControlComponent } from "./grafica-linea-control/grafica-linea-control.component";
import { GraficaPieControlComponent } from "./grafica-torta-control/grafica-torta-control.component";
import { ChartsModule } from 'ng2-charts';
@NgModule({
    imports: [
        GeneralControlsModule,
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        AngularMyDatePickerModule,
        ChartsModule,
     
    ],

    declarations: [
        FiltroReporteControl,
        GraficaPieControlComponent,
        GraficaLineControlComponent,

    ],
    exports: [
        FiltroReporteControl,
        GraficaPieControlComponent,
        GraficaLineControlComponent,        
    ]
})
export class reportControlsModule { }