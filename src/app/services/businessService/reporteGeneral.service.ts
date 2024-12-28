import { Injectable } from '@angular/core';
import { ReportePeticion } from 'app/models/generalModels/reportePeticion.model';
import { ReporteRespuesta } from 'app/models/generalModels/reporteRespuesta.model';
import { ReporteListarRespuesta } from 'app/models/generalModels/transferObjects/reporteListarRespuesta.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';


@Injectable({ providedIn: 'root' })
export class ReporteGeneralService extends BaseRepositoryService<ReportePeticion, ReporteListarRespuesta> {

 
      async reporteDistribucion(datos: ReportePeticion): Promise<ReporteRespuesta> {
        await this.verificarSesion();
    
        let retorno: ReporteRespuesta = new ReporteRespuesta();
        await this._http.post<boolean>(this.url.format(this._nombreController, "ReporteDistribucion"), datos, this.getConfigHeaders())
          .toPromise()
          .then(res => {
            retorno = Object.assign(retorno, res);
          })
          .catch(error => {
            this.handleError(error);
          });
        return retorno;
      }
      async reporteHistograma(datos: ReportePeticion): Promise<ReporteRespuesta> {
        await this.verificarSesion();
    
        let retorno: ReporteRespuesta = new ReporteRespuesta();
        await this._http.post<boolean>(this.url.format(this._nombreController, "ReporteHistograma"), datos, this.getConfigHeaders())
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