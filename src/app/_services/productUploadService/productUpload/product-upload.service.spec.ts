import { TestBed } from '@angular/core/testing';

import { ProductUploadService } from './product-upload.service';

describe('ProductUploadService', () => {
  let service: ProductUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
