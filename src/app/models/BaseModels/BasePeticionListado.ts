import { PaginadorPeticion } from '../common/PaginadorPeticion';
import { Orden } from '../common/Orden';
import { Filtro } from '../common/Filtro';

export class BasePeticionListado {

  constructor(
    public Paginador: PaginadorPeticion,
    public Orden: Orden,
    public Filtros: Filtro[],
    public RetornarSinEspecificar: boolean = false
  ) { }

}