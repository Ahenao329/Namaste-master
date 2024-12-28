import { BaseRespuestaListado } from "app/models/BaseModels/BaseRespuestaListado";
import { ReporteRespuesta } from "../reporteRespuesta.model";

export class ReporteListarRespuesta extends BaseRespuestaListado{
    public listReporteRespuesta: ReporteRespuesta[]=[];
}