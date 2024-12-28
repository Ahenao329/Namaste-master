import { Injectable } from '@angular/core';
import { RegistroDiarioEmocionListarRespuesta } from '../../models/businessModels/transferObjects/registroDiarioEmocionListarRespuesta.model';
import { RegistroDiarioEmocion } from '../../models/businessModels/registroDiarioEmocion.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';
import { BotonPanico } from 'app/models/businessModels/botonPanico.model';

@Injectable({ providedIn: 'root' })
export class RegistroDiarioEmocionService extends BaseRepositoryService<RegistroDiarioEmocion, RegistroDiarioEmocionListarRespuesta> {

    async validarTokenRegistro(token:string): Promise<RegistroDiarioEmocion> {
        await this.verificarSesion();
    
        let retorno: RegistroDiarioEmocion = new RegistroDiarioEmocion();
        await this._http.get<RegistroDiarioEmocion>(this.url.format(this._nombreController, "ValidarTokenRegistro") + "/" + token, this.getConfigHeaders())
          .toPromise()
          .then(res => {
            retorno = Object.assign(retorno, res);
          })
          .catch(error => {
            this.handleError(error)
          });
    
        return retorno;
      }

      async actualizarTipoEmocion(datos: RegistroDiarioEmocion): Promise<RegistroDiarioEmocion> {
        await this.verificarSesion();
    
        let retorno: RegistroDiarioEmocion = new RegistroDiarioEmocion();
        await this._http.put<boolean>(this.url.format(this._nombreController, "ActualizarTipoEmocion"), datos, this.getConfigHeaders())
          .toPromise()
          .then(res => {
            retorno = Object.assign(retorno, res);
          })
          .catch(error => {
            this.handleError(error);
          });
        return retorno;
      }
      async registrarBotonPanico(datos: BotonPanico): Promise<BotonPanico> {
        await this.verificarSesion();
    
        let retorno: BotonPanico = new BotonPanico();
        await this._http.post<BotonPanico>(this.url.format(this._nombreController, "RegistrarBotonPanico"), datos, this.getConfigHeaders())
          .toPromise()
          .then(res => {
            retorno = Object.assign(retorno, res);
          })
          .catch(error => {
            this.handleError(error);
          });
        return retorno;
      }

}