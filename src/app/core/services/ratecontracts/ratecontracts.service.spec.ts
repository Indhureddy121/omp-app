/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RatecontractsService } from './ratecontracts.service';

describe('Service: Ratecontracts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatecontractsService]
    });
  });

  it('should ...', inject([RatecontractsService], (service: RatecontractsService) => {
    expect(service).toBeTruthy();
  }));
});
