import { TestBed } from '@angular/core/testing';

import { CajaHerramientaParamService } from './caja-herramienta-param.service';

describe('CajaHerramientaParamService', () => {
  let service: CajaHerramientaParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaHerramientaParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
