import { BaseRespuestaListado } from "app/models/BaseModels/BaseRespuestaListado";
import { TipoHerramientaCaja } from "../tipoHerramientaCaja.model";

export class TipoHerramientaCajaListarRespuesta extends BaseRespuestaListado{
    listTipoHerramientaCajaRespuesta:TipoHerramientaCaja[]=[];
}