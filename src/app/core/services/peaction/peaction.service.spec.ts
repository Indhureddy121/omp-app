import { TestBed } from '@angular/core/testing';

import { PeactionService } from './peaction.service';

describe('PeactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeactionService = TestBed.get(PeactionService);
    expect(service).toBeTruthy();
  });
});
