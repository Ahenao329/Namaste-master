import { BaseRespuestaListado } from '../../BaseModels/BaseRespuestaListado';
import { Perfiles } from '../perfiles.model';

export class PerfilesListarRespuesta extends BaseRespuestaListado {
  public listPerfilesRespuesta: Perfiles[] = [];
}