import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpShowInfoData } from '../../../models/appModels/popupShowInfo.model';

@Component({
    selector: 'app-popUpShowInfo',
    templateUrl: './popUpShowInfo.template.html'
})

export class popupShowInfoDialogComponent {
    rutaImagen: string;

    public data: PopUpShowInfoData;

    constructor(public dialogRef: MatDialogRef<popupShowInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataIn: PopUpShowInfoData) {
       
        this.data = dataIn;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

}

