import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './Grid/list.component';
import { DynamicPipe } from './Grid/dynamic.pipes';
import { popupAlertDialogComponent } from './PopUpAlert/popUpAlert.component'
import { MaterialModule } from '../../shared/modules/material.module';
import { popupConfirmDialogComponent } from './PopUpConfirm/popUpConfirm.component';

import { RouterModule } from '../../../../node_modules/@angular/router';
import { popupShowInfoDialogComponent } from './PopUpShowInfo/popUpShowInfo.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AvatarUsuarioComponent } from './avatar-usuario/avatar-usuario.component';
import { CuentaUsuarioComponent } from './cuenta-usuario/cuenta-usuario.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { ImageCropperModule } from 'ngx-image-cropper';
import { SeleccionarImagenControlComponent } from './seleccionar-imagen-control/seleccionar-imagen-control.component';
import { PopUpFotoComponent } from './popup-foto/popup-foto.component';
import { ChartsModule } from 'ng2-charts';
import { LayoutModule } from '../layout.module';
import { CategoriaHerramientaAdminPopupComponent } from './popup-herramientas/categoria-herramienta-admin-popup.component';
import { CajaHerramientaListarPopupComponent } from './popup-herramientas/caja-herramienta-listar-popup.component';
import { CategoriaHerramientaListarPopupComponent } from './popup-herramientas/categoria-herramienta-listar-popup.component';
import { CajaHerramientaAdminPopupComponent } from './popup-herramientas/caja-herramienta-admin-popup.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        AngularMyDatePickerModule,
        AngularEditorModule,
        ChartsModule,
        ImageCropperModule,
                
    ],

    declarations: [ListComponent, 
        DynamicPipe, 
        popupAlertDialogComponent, 
        popupConfirmDialogComponent,
        popupShowInfoDialogComponent,
        AvatarUsuarioComponent,        
        CuentaUsuarioComponent,
        SeleccionarImagenControlComponent,
        PopUpFotoComponent,
        CategoriaHerramientaAdminPopupComponent,
        CajaHerramientaListarPopupComponent,
        CategoriaHerramientaListarPopupComponent,
        CajaHerramientaAdminPopupComponent, 
    ],

    exports: [ListComponent, 
        popupAlertDialogComponent, 
        popupConfirmDialogComponent,
        popupShowInfoDialogComponent,
        AvatarUsuarioComponent,        
        CuentaUsuarioComponent,
        SeleccionarImagenControlComponent,
        PopUpFotoComponent,
     
    ]
})
export class GeneralControlsModule { }
