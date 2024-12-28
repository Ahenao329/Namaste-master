
export class ManejoErrorPopUp {
    public NumeroError: number=0;
    public Mensaje: string='';

    constructor(numeroError, mensaje) {
        this.NumeroError = numeroError;
        this.Mensaje = mensaje;
    }
}