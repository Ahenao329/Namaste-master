import { BaseRespuestaListado } from "app/models/BaseModels/BaseRespuestaListado";
import { CategoriaHerramientaCaja } from "../categoriaHerramientaCaja.model";

export class CategoriaHerramientaCajaListarRespuesta extends BaseRespuestaListado {
    listCategoriaHerramientaCajaRespuesta: CategoriaHerramientaCaja[] = [];
}