export class RegistroDiarioEmocion {
  public idRegistroDiarioEmocion: number;
  public idUsuario: number;
  public idTipoEmocion?: number;
  public fecha: Date;
  public fechaView: any;
  public token: string = '';
  public fechaRegistroUsuario?: Date;
  public fechaRegistroUsuarioView?: any;
  public fechaCreacionRegistro: Date;
  public fechaCreacionRegistroView: any;
  public observaciones: string = '';
  public correoEnviado: boolean;
  public fechaEnvioCorreo?: Date;
  public fechaEnvioCorreoView?: any;

  //CVO
  public usuarioNombre: string = '';
  public tipoEmocionNombre?: string = '';
  public tipoEmocionRutaImagenFrontEnd: string = '';
}