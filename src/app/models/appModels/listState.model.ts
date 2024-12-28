import { EnumRecursos } from "../../shared/enums/commonEnums";
import { ListStateFilters } from "./listStateFilters.model";

export class ListState {
    public Recurso: EnumRecursos;
    public Orden: { campoOrden: string, tipoOrden: string };
    public Busqueda: { field: string, value: string };
    public PaginaActual: number;
    public OtrosFiltros: ListStateFilters[];
    constructor() {

    }
}