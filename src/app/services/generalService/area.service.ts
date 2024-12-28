import { Injectable } from "@angular/core";
import { Area } from "app/models/generalModels/area.model";
import { AreaListarRespuesta } from "app/models/generalModels/transferObjects/areaListarRespuesta.model";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class AreaService extends BaseRepositoryService<Area, AreaListarRespuesta> {
    
}