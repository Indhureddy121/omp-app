import { TestBed } from '@angular/core/testing';

import { HsnmasterService } from './hsnmaster.service';

describe('HsnmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HsnmasterService = TestBed.get(HsnmasterService);
    expect(service).toBeTruthy();
  });
});
