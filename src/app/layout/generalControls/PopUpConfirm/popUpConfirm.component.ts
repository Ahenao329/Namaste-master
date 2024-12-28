import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs'
import { Router } from '@angular/router';
import { PopUpConfirmData } from '../../../models/appModels/popupConfirm.model';
import { EnumTipoConfirm } from '../../../shared/enums/commonEnums';

@Component({
    selector: 'app-popupConfirm',
    templateUrl: './popupConfirm.template.html'
})

export class popupConfirmDialogComponent {
    rutaImagen: string;
    _mostrarCancelar: boolean = true;
    _mostrarAceptar: boolean = true;

    public data: PopUpConfirmData;

    constructor(private _router: Router,
        public dialogRef: MatDialogRef<popupConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataIn: PopUpConfirmData) {

        if (dataIn.tipoConfir == EnumTipoConfirm.Confirmacion)
            this.rutaImagen = 'assets/images/question.png'
        else
            this.rutaImagen = 'assets/images/info-ico.png'

        this.data = dataIn;

        if (this.data.textoCancelar.trim().length == 0)
            this._mostrarCancelar = false;

        if (this.data.textoAceptar.trim().length == 0)
            this._mostrarAceptar = false;

    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onOkClick(): void {
        this.dialogRef.close(true);
    }

}

