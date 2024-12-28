export class FilterItem {
    operadorLogico: string = '';
    campoFiltro: string = '';
    condicional: string = '';
    valor: string = '';

    constructor(operador: string, filtro: string, condionalIn: string, valorIn: string) {
        this.operadorLogico = operador;
        this.campoFiltro = filtro;
        this.condicional = condionalIn;
        this.valor = valorIn;
    }
}

