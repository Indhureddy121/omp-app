import { TestBed } from '@angular/core/testing';

import { ProductmasterService } from './productmaster.service';

describe('ProductmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductmasterService = TestBed.get(ProductmasterService);
    expect(service).toBeTruthy();
  });
});
