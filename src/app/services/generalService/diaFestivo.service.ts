import { Injectable } from "@angular/core";
import { DiaFestivo } from "app/models/generalModels/dia-festivo.model";
import { DiaFestivoListarRespuesta } from "app/models/generalModels/transferObjects/diaFestivoListarRespuesta.model";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class DiaFestivoService extends BaseRepositoryService<DiaFestivo, DiaFestivoListarRespuesta> {


    async buscar(id: number): Promise<DiaFestivo> {
        var retorno: DiaFestivo = await super.buscar(id);
        return retorno;
    }

}