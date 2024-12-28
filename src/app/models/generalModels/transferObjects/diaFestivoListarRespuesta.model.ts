import { BaseRespuestaListado } from "app/models/BaseModels/BaseRespuestaListado";
import { DiaFestivo } from "../dia-festivo.model";

export class DiaFestivoListarRespuesta extends BaseRespuestaListado{
    public listDiaFestivoRespuesta:DiaFestivo[]=[];
}