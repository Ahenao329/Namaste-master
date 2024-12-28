import { Injectable } from '@angular/core';
import { BotonPanicoListarRespuesta } from '../../models/businessModels/transferObjects/botonPanicoListarRespuesta.model';
import { BotonPanico } from '../../models/businessModels/botonPanico.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';
import { MyDatePicker } from 'app/models/appModels/myDatePicker.model';

@Injectable({ providedIn: 'root' })
export class BotonPanicoService extends BaseRepositoryService<BotonPanico, BotonPanicoListarRespuesta> {

    async crear(datos: BotonPanico): Promise<BotonPanico> {

        if (datos.fechaAtencionView)
            datos.fechaAtencion = datos.fechaAtencionView.singleDate.jsDate;
        else
            datos.fechaAtencion = undefined;

        return await super.crear(datos);
    }

    async buscar(id: number): Promise<BotonPanico> {

        var retorno: BotonPanico = await super.buscar(id);

        if (retorno && retorno.fechaCreacion)
            retorno.fechaCreacionView = new MyDatePicker(new Date(retorno.fechaCreacion));

        if (retorno && retorno.fechaAtencion)
            retorno.fechaAtencionView = new MyDatePicker(new Date(retorno.fechaAtencion));

        return retorno;
    }

    async modificar(datos: BotonPanico): Promise<boolean> {

        if (datos.fechaAtencionView)
            datos.fechaAtencion = datos.fechaAtencionView.singleDate.jsDate;
        else
            datos.fechaAtencion = undefined;

        return await super.modificar(datos);
    }


}