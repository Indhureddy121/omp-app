import { TestBed } from '@angular/core/testing';

import { PriceconfigurationService } from './priceconfiguration.service';

describe('PriceconfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceconfigurationService = TestBed.get(PriceconfigurationService);
    expect(service).toBeTruthy();
  });
});
