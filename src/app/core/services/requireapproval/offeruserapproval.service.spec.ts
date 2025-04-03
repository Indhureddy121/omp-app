import { TestBed } from '@angular/core/testing';

import { OfferuserapprovalService } from './offeruserapproval.service';

describe('OfferuserapprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfferuserapprovalService = TestBed.get(OfferuserapprovalService);
    expect(service).toBeTruthy();
  });
});
