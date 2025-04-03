import { TestBed } from '@angular/core/testing';

import { MarketingMaterialService } from './marketing-material.service';

describe('MarketingMaterialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketingMaterialService = TestBed.get(MarketingMaterialService);
    expect(service).toBeTruthy();
  });
});
