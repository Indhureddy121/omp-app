import { TestBed } from '@angular/core/testing';

import { ApprovalmatrixService } from './approvalmatrix.service';

describe('ApprovalmatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalmatrixService = TestBed.get(ApprovalmatrixService);
    expect(service).toBeTruthy();
  });
});
