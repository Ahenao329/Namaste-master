export class Filtro {

  constructor(
    public operadorLogico: string,
    public campoFiltro: string,
    public condicional: string,
    public valor: string
  ) { }
}