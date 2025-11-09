import { TestBed } from '@angular/core/testing';

import { ModifiedProductFilesService } from './modified-product-files.service';

describe('ModifiedProductFilesService', () => {
  let service: ModifiedProductFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifiedProductFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
