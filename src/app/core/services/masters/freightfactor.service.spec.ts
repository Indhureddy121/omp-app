import { TestBed } from '@angular/core/testing';

import { FreightfactorService } from './freightfactor.service';

describe('FreightfactorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreightfactorService = TestBed.get(FreightfactorService);
    expect(service).toBeTruthy();
  });
});
