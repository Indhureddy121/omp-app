import { TestBed } from '@angular/core/testing';

import { ScreenAssignmentService } from './screen-assignment.service';

describe('ScreenAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenAssignmentService = TestBed.get(ScreenAssignmentService);
    expect(service).toBeTruthy();
  });
});
