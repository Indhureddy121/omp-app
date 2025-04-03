import { TestBed } from '@angular/core/testing';

import { AsmactionService } from './asmaction.service';

describe('AsmactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsmactionService = TestBed.get(AsmactionService);
    expect(service).toBeTruthy();
  });
});
