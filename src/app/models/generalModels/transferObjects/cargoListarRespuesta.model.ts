import { BaseRespuestaListado } from "app/models/BaseModels/BaseRespuestaListado";
import { Cargo } from "../cargo.model";

export class CargoListarRespuesta extends BaseRespuestaListado{
    public listCargoRespuesta:Cargo[]=[];
}