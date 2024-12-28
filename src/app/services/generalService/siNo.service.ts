import { Injectable } from "@angular/core";
import { SiNo } from "app/models/generalModels/siNo.model";
import { SiNoListarRespuesta } from "app/models/generalModels/transferObjects/siNoListarRespuesta";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class SinoService extends BaseRepositoryService<SiNo, SiNoListarRespuesta> {
    
}