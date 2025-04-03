import { TestBed } from '@angular/core/testing';

import { PriceconfigurationalpService } from './priceconfigurationalp.service';

describe('PriceconfigurationalpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceconfigurationalpService = TestBed.get(PriceconfigurationalpService);
    expect(service).toBeTruthy();
  });
});
