import { NgModule } from '@angular/core';
import { GeneralControlsModule } from '../generalControls/generalControls.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PopupSeleccionarImagenComponent } from './popup-seleccionar-imagen/popup-seleccionar-imagen.component';

@NgModule({
    imports: [
        GeneralControlsModule,
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,       
        ImageCropperModule, 
    ],

    declarations: [
     PopupSeleccionarImagenComponent     
    ],
    exports: [       
    ]

})
export class BusinessControlsModule { }