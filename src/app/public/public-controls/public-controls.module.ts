import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '../../shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/modules/material.module';


import { BusinessControlsModule } from 'app/layout/businessControls/businessControls.module';


import { GeneralControlsModule } from 'app/layout/generalControls/generalControls.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [     
        GeneralControlsModule,   
        BusinessControlsModule,
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule, 
        MatSnackBarModule,                       
       
        
    ],
    declarations: [
      


    ],
    exports: [
       
    ]
})
export class PublicControlsModule { }