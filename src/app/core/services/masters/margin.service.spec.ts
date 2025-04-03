import { TestBed } from '@angular/core/testing';

import { MarginService } from './margin.service';

describe('MarginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarginService = TestBed.get(MarginService);
    expect(service).toBeTruthy();
  });
});
