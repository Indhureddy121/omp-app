import { TestBed } from '@angular/core/testing';

import { RmcostmasterService } from './rmcostmaster.service';

describe('RmcostmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RmcostmasterService = TestBed.get(RmcostmasterService);
    expect(service).toBeTruthy();
  });
});
