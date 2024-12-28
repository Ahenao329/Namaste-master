import { TestBed } from '@angular/core/testing';

import { TipoEmocionService } from './tipo-emocion.service';

describe('TipoEmocionService', () => {
  let service: TipoEmocionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEmocionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
