import { Injectable, Output, EventEmitter } from '@angular/core';
import { CajaHerramientaAdminPopupComponent } from 'app/layout/generalControls/popup-herramientas/caja-herramienta-admin-popup.component';
import { CajaHerramientaListarPopupComponent } from 'app/layout/generalControls/popup-herramientas/caja-herramienta-listar-popup.component';
import { HerramientaCaja } from 'app/models/generalModels/herramientaCaja.model';
import { HerramientaCajaListarRespuesta } from 'app/models/generalModels/transferObjects/herramientaCajaListarRespuesta';
import { herramientaParams } from 'app/models/generalModels/transferObjects/herramientaParams.model';
import { BaseRepositoryService } from '../repository/baseRepository.service';

@Injectable({
  providedIn: 'root'
})
export class CajaHerramientaParamService  {
@Output() disparadorDeHerramientaParams: EventEmitter<any> = new EventEmitter();
}
