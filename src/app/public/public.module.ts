import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { SharedModule } from '../shared/modules/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InicioComponent } from './inicio/inicio.component';
import { ChartsModule } from 'ng2-charts';
import { RegistroDiarioEmocionAdminComponent } from './registro-diario-emocion/registro-diario-emocion-admin.component';
import { PopupBotonPanicoConfirmacionControlComponent } from './registro-diario-emocion/popup-boton-panico-confirmacion-control.component';

@NgModule({
    imports: [
        CommonModule,
        PublicRoutingModule,
        TranslateModule,
        SharedModule.forRoot(),           
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCardModule,   
        MatSnackBarModule,
        
        ChartsModule,
    ],
    declarations: [               
        InicioComponent,   
        RegistroDiarioEmocionAdminComponent,
        PopupBotonPanicoConfirmacionControlComponent,
             

    ]
})
export class PublicModule { }