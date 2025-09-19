import { TestBed } from '@angular/core/testing';

import { EngineXService } from './engine-x.service';

describe('EngineXService', () => {
  let service: EngineXService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineXService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
