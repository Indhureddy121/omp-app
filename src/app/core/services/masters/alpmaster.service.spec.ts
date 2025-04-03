import { TestBed } from '@angular/core/testing';

import { AlpmasterService } from './alpmaster.service';

describe('AlpmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlpmasterService = TestBed.get(AlpmasterService);
    expect(service).toBeTruthy();
  });
});
