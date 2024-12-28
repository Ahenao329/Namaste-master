import { Injectable } from "@angular/core";
import { TipoHerramientaCaja } from "app/models/generalModels/tipoHerramientaCaja.model";
import { TipoHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/tipoHerramientaCajaListarRespuesta";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class tipoHerramientaCajaService extends BaseRepositoryService<TipoHerramientaCaja, TipoHerramientaCajaListarRespuesta> {

}