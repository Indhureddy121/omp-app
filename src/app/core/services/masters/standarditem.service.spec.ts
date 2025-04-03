import { TestBed } from '@angular/core/testing';

import { StandarditemService } from './standarditem.service';

describe('StandarditemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandarditemService = TestBed.get(StandarditemService);
    expect(service).toBeTruthy();
  });
});
