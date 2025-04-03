import { TestBed } from '@angular/core/testing';

import { BroadcastsService } from './broadcasts.service';

describe('BroadcastsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BroadcastsService = TestBed.get(BroadcastsService);
    expect(service).toBeTruthy();
  });
});
