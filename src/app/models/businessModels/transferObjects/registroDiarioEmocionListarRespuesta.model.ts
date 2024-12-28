import { BaseRespuestaListado } from 'app/models/BaseModels/BaseRespuestaListado';
import { RegistroDiarioEmocion } from '../registroDiarioEmocion.model';

export class RegistroDiarioEmocionListarRespuesta extends BaseRespuestaListado {
  public listRegistroDiarioEmocionRespuesta: RegistroDiarioEmocion[] = [];
}