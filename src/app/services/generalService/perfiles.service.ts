import { Injectable, OnInit } from '@angular/core';
import { PerfilesListarRespuesta } from '../../models/generalModels/transferObjects/perfilesListarRespuesta.model';
import { Perfiles } from '../../models/generalModels/perfiles.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';

@Injectable({ providedIn: 'root' })
export class PerfilesService extends BaseRepositoryService<Perfiles, PerfilesListarRespuesta> {

}