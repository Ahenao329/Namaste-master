import { Injectable } from '@angular/core';
import { UsuarioListarRespuesta } from '../../models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { Usuario } from '../../models/generalModels/usuario.model';
import { SSException } from '../../shared/exceptions/ssexception';
import { CambiarContrasenaPeticion } from '../../models/generalModels/cambiarContrasenaPeticion.model';
import { EstablecerContrasenaRespuesta } from '../../models/generalModels/establecerContrasenaRespuesta.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseRepositoryService<Usuario, UsuarioListarRespuesta> {

  async reenviarCorreoInicio(id: number): Promise<boolean> {
    await this.verificarSesion();

    let retorno: boolean = false;
    await this._http.get<Usuario>(this.url.format(this._nombreController, "ReenviarCorreoInicio") + "/" + id.toString(), this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Boolean(res);
      })
      .catch(error => {
        if (error instanceof SSException)
          throw error;
        else
          this.handleError(error)
      });
    return retorno;
  }

  async cambiarContrasena(datos: CambiarContrasenaPeticion): Promise<EstablecerContrasenaRespuesta> {  
    let retorno: EstablecerContrasenaRespuesta = new EstablecerContrasenaRespuesta();
    await this._http.post<Usuario>(this.url.format(this._nombreController, "CambiarContrasena"), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async cambiarAvatar(datos: Usuario): Promise<Usuario> {  
    let retorno: Usuario = new Usuario();
    await this._http.put<Usuario>(this.url.format(this._nombreController, "CambiarAvatar"), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async editarMiPerfil(datos: Usuario): Promise<Usuario> {  
    let retorno: Usuario = new Usuario();
    await this._http.put<Usuario>(this.url.format(this._nombreController, "EditarMiPerfil"), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }
 
}