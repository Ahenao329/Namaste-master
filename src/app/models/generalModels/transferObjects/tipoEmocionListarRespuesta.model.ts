import { BaseRespuestaListado } from 'app/models/BaseModels/BaseRespuestaListado';
import { TipoEmocion } from '../tipoEmocion.model';

export class TipoEmocionListarRespuesta extends BaseRespuestaListado {
  public listTipoEmocionRespuesta: TipoEmocion[] = [];
}