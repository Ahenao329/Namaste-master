import { BaseRespuestaListado } from '../../BaseModels/BaseRespuestaListado';
import { Usuario } from '../usuario.model';

export class UsuarioListarRespuesta extends BaseRespuestaListado {
  public listUsuarioRespuesta: Usuario[] = [];
}