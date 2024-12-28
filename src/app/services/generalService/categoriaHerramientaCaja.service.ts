import { Injectable } from "@angular/core";
import { CategoriaHerramientaCaja } from "app/models/generalModels/categoriaHerramientaCaja.model";
import { CategoriaHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class CategoriaHerramientaCajaService extends BaseRepositoryService<CategoriaHerramientaCaja, CategoriaHerramientaCajaListarRespuesta> {

}