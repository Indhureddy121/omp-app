import { TestBed } from '@angular/core/testing';

import { FmactionService } from './fmaction.service';

describe('FmactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FmactionService = TestBed.get(FmactionService);
    expect(service).toBeTruthy();
  });
});
