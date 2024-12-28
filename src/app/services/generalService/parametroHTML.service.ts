import { Injectable } from '@angular/core';
import { ParametroHTMLListarRespuesta } from '../../models/generalModels/transferObjects/parametroHTMLListarRespuesta.model';
import { ParametroHTML } from '../../models/generalModels/parametroHTML.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';

@Injectable({ providedIn: 'root' })
export class ParametroHTMLService extends BaseRepositoryService<ParametroHTML, ParametroHTMLListarRespuesta> {


}