import {Usuario} from "./usuario.model";
import {Parametro} from "./parametro.model";
import {RecursosXPerfil} from "./recursosXPerfil.model";

export class LoginRespuesta {
    public usuario: Usuario;
    public listRecursosXPerfil: Array<RecursosXPerfil>;
    public listParametros: Array<Parametro>;

  }