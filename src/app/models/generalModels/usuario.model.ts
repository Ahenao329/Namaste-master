import { BaseModelo } from '../BaseModels/BaseModelo';

export class Usuario extends BaseModelo {
  public idUsuario: number;
  public email: string = '';
  public contrasena: string = '';
  public nombre: string = '';
  public idPerfil: number;
  public activo: boolean = true;
  public token: string = '';
  public celular: string = '';
  //Últimos campos agregados
  public idLider: number;
  public usuarioNombreLider:string='';
  public idEncargadoSaludEmocional: number;
  public usuarioNombreEncargadoSaludEmocional:string='';
  public idCargo: number;
  public cargoNombre:string='';
  public idArea: number;
  public areaNombre:string='';

  public reportaEmociones: boolean;
  public conCorreoDiario: boolean;

  //public tokenFecha?: Date;
  //public fechaTokenView?: any;

  public establecioContrasena: boolean;

  public perfilNombre: string;
  public imagenBase64: string = '';
  public rutaImagenFrontEnd: string = '';
  
  //No CVO
  public idRegistroDocente?: number;

}