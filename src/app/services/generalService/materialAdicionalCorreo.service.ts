import { Injectable } from "@angular/core";
import { MaterialAdicionalCorreo } from "app/models/generalModels/materia-adicional-correo.model";
import { MaterialAdicionalCorreoListarRespuesta } from "app/models/generalModels/transferObjects/materialAdicionalCorreoListarRespuesta.model";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class MaterialAdicionalCorreoService extends BaseRepositoryService<MaterialAdicionalCorreo, MaterialAdicionalCorreoListarRespuesta> {
   
    async buscar(id: number): Promise<MaterialAdicionalCorreo> {
        var retorno: MaterialAdicionalCorreo = await super.buscar(id);
        return retorno;
    }

}