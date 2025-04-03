import { TestBed } from '@angular/core/testing';

import { CostmastertrdService } from './costmastertrd.service';

describe('CostmastertrdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostmastertrdService = TestBed.get(CostmastertrdService);
    expect(service).toBeTruthy();
  });
});
