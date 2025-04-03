import { TestBed } from '@angular/core/testing';

import { RatecontractService } from './ratecontract.service';

describe('RatecontractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RatecontractService = TestBed.get(RatecontractService);
    expect(service).toBeTruthy();
  });
});
