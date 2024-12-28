import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs'
import { Router } from '@angular/router';

@Component({
    selector: 'app-popupAlert',
    templateUrl: './popupAlert.template.html',
    styleUrls: ['./popupAlert.component.scss'],

})

export class popupAlertDialogComponent {
    rutaImagen: string;

    constructor(private _router: Router,
        public dialogRef: MatDialogRef<popupAlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data.TipoAlert == EnumTipoAlerta.Confirmacion)
            this.rutaImagen = 'assets/images/check-mark.png'
        else if (data.TipoAlert == EnumTipoAlerta.Error)
            this.rutaImagen = 'assets/images/error.png'

        /*var numbers = Observable.timer(data.Timer * 2000); // en segundos 
        numbers.subscribe(x => {
            this.dialogRef.close();           
            if (data.Ruta && data.Ruta !== "")
                this._router.navigate([data.Ruta]);
        });*/
        setTimeout(() => {
            this.dialogRef.close();
            if (data.Ruta && data.Ruta !== "")
                this._router.navigate([data.Ruta]);
        }, data.Timer * 1000); // en segundos 

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
/**Tipo de alerta Confirmacion, Error */
export enum EnumTipoAlerta {
    Confirmacion = 1,
    Error
}