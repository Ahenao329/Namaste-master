import { PaginadorPeticion } from './PaginadorPeticion';
export class PaginadorRespuesta extends PaginadorPeticion {

  public totalRegistros: number = 0;
  public numeroPaginas: number = 0;
  public primerRegistro: number = 1;
  public ultimoRegistro: number = 0;
}