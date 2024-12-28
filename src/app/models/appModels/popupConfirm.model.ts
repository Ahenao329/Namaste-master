import { popUpBase } from './popUpBase.model';
import { EnumTipoConfirm } from '../../shared/enums/commonEnums';

export class PopUpConfirmData extends popUpBase {
    tipoConfir:EnumTipoConfirm = EnumTipoConfirm.Confirmacion;
    
    PopUpConfirmData(tituloIn: string = '¿Está seguro que desea eliminar este registro?') {
        this.titulo = tituloIn;
    }
}