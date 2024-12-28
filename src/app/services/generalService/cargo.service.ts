import { Injectable } from '@angular/core';
import { Cargo } from 'app/models/generalModels/cargo.model';
import { CargoListarRespuesta } from 'app/models/generalModels/transferObjects/cargoListarRespuesta.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';

@Injectable({ providedIn: 'root' })
export class CargoService extends BaseRepositoryService<Cargo, CargoListarRespuesta> {
    
}

