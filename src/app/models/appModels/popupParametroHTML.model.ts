import { EnumParametrosHTML } from 'app/shared/enums/commonEnums';


export class PopupParametroHTML {
    idParametro: EnumParametrosHTML;
    titulo: string;

    constructor(idParametro: EnumParametrosHTML, titulo: string) {
        this.idParametro = idParametro;
        this.titulo = titulo;
    }
}