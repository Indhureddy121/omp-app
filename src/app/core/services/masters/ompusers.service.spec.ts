import { TestBed } from '@angular/core/testing';

import { OmpusersService } from './ompusers.service';

describe('OmpusersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmpusersService = TestBed.get(OmpusersService);
    expect(service).toBeTruthy();
  });
});
