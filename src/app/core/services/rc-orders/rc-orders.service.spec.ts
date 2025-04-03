import { TestBed } from '@angular/core/testing';

import { RcOrdersService } from './rc-orders.service';

describe('RcOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RcOrdersService = TestBed.get(RcOrdersService);
    expect(service).toBeTruthy();
  });
});
