import { Injectable } from '@angular/core';
import { ParametroFuncional } from '../../models/generalModels/parametroFuncional.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';
import { ParametroFuncionalListarRespuesta } from 'app/models/generalModels/transferObjects/parametroFuncionalListarRespuesta.model';

@Injectable({ providedIn: 'root' })

export class ParametroFuncionalService extends BaseRepositoryService<ParametroFuncional, ParametroFuncionalListarRespuesta> {
  
}