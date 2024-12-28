export class  HerramientaCaja {
    public idHerramientaCaja: number;
    public idTipoHerramientaCaja: number;
    public idCategoriaHerramientaCaja: number;
    public titulo: string = '';
    public descripcion: string = '';
    public ruta: string = '';
    public tamanoArchivoEnMB: number;
    public activo: boolean;
    public numeroConsultas: number;

    //CVO
    public archivoBase64: string = '';
    public archivoNombreFrontTemp: string = '';
}