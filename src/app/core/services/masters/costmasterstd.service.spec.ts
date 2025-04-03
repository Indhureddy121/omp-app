import { TestBed } from '@angular/core/testing';

import { CostmasterstdService } from './costmasterstd.service';

describe('CostmasterstdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostmasterstdService = TestBed.get(CostmasterstdService);
    expect(service).toBeTruthy();
  });
});
