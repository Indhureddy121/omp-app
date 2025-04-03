import { TestBed } from '@angular/core/testing';

import { OcactionService } from './ocaction.service';

describe('OcactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OcactionService = TestBed.get(OcactionService);
    expect(service).toBeTruthy();
  });
});
