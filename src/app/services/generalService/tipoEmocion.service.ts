import { Injectable } from '@angular/core';
import { TipoEmocionListarRespuesta } from '../../models/generalModels/transferObjects/tipoEmocionListarRespuesta.model';
import { TipoEmocion } from '../../models/generalModels/tipoEmocion.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';
import { ColorPicker } from 'app/models/appModels/colorPicker.model';
import { parse } from 'path';
import { concat } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TipoEmocionService extends BaseRepositoryService<TipoEmocion, TipoEmocionListarRespuesta> {

    async crear(datos: TipoEmocion): Promise<TipoEmocion> {

        if (datos.colorView)
            datos.color = datos.colorView.hex;

        return await super.crear(datos);
    }

    async buscar(id: number): Promise<TipoEmocion> {

        var retorno: TipoEmocion = await super.buscar(id);

        if (retorno.color)
            retorno.colorView = JSON.stringify(retorno.color)
            retorno.colorView  = JSON.parse(retorno.colorView)

            if(retorno.colorView.indexOf('#')==-1)
            retorno.colorView = '#'+retorno.colorView


        return retorno;
    }

    async modificar(datos: TipoEmocion): Promise<boolean> {

        if (datos.colorView)
            datos.color = datos.colorView.hex;
        else
            datos.color = undefined;


        return await super.modificar(datos);
    }

}