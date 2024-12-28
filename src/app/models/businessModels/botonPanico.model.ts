export class BotonPanico {
  public idBotonPanico: number;
  public idUsuario: number;
  public idUsuarioAtiende?: number;
  public fechaCreacion: Date;
  public fechaCreacionView: any;
  public fechaAtencion?: Date;
  public fechaAtencionView?: any;
  public fechaRegistroAtencion?: Date;
  public fechaRegistroAtencionView?: any;
  public observacionesAtencion: string = '';
  public observacionesSolicitante: string = '';
  public email: string = '';
  public celular: string = '';

  //CVO
  public usuarioIdEncargadoSaludEmocional:number;
  public usuarioNombre: string = '';
  public usuarioAtiendeNombre?: string = '';
  public tokenCorreo: string = '';
}