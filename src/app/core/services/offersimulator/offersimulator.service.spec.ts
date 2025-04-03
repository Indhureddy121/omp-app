import { TestBed } from '@angular/core/testing';

import { OffersimulatorService } from './offersimulator.service';

describe('OffersimulatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffersimulatorService = TestBed.get(OffersimulatorService);
    expect(service).toBeTruthy();
  });
});
