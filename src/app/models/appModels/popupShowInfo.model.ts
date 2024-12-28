import { popUpBase } from './popUpBase.model';

export class PopUpShowInfoData extends popUpBase {
    textoCancelar = 'Cerrar';
    PopUpShowInfoData(descripcionIn: string = '') {
        this.descripcion = descripcionIn;
    }

}