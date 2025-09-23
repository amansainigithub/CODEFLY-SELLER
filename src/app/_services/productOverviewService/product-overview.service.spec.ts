import { TestBed } from '@angular/core/testing';

import { ProductOverviewService } from './product-overview.service';

describe('ProductOverviewService', () => {
  let service: ProductOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
