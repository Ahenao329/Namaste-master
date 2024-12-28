import { Injectable } from "@angular/core";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { HerramientaCajaBuscar } from "app/models/generalModels/herramientaCajaBuscar.model";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";
import { SSException } from "app/shared/exceptions/ssexception";
import { BaseRepositoryService } from "../repository/baseRepository.service";

@Injectable({ providedIn: 'root' })
export class HerramientaCajaService extends BaseRepositoryService<HerramientaCaja, HerramientaCajaListarRespuesta> {
    async obtenerArchivo(id: number): Promise<Blob> {
        await this.verificarSesion();
    
        let retorno: any;    
        await this._http.get<Blob>(this.url.format(this._nombreController, "ObtenerArchivo") + '/' + id.toString(), this.getConfigHeaders(600, true))
          .toPromise()
          .then(res => {
            
            if (!res)
              this.lanzarExceptionNoExistencia();
    
            retorno = res;
          })
          .catch(error => {
            this.handleError(error);
          });
        return retorno;
      }
      async herramientaCajaBuscar(datos: HerramientaCajaBuscar): Promise<HerramientaCaja[]> {
        let retorno: HerramientaCaja[] = [];
        await this._http.post<HerramientaCajaBuscar>(this.url.format(this._nombreController, "ListConsultaUsuario"), datos, this.getConfigHeaders())
            .toPromise()
            .then(res => {
                retorno = Object.assign(retorno, res);
            })
            .catch(error => {
                this.handleError(error)
            });
        return retorno;
    }

    async incrementarNumeroConsultasLink(id: number): Promise<boolean> {
      await this.verificarSesion();
  
      let retorno: boolean;
      await this._http.get<boolean>(this.url.format(this._nombreController, "") + "IncrementarNumeroConsultasLink/" + id.toString(), this.getConfigHeaders())
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
}