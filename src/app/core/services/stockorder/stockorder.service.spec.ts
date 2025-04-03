import { TestBed } from '@angular/core/testing';

import { StockorderService } from './stockorder.service';

describe('StockorderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockorderService = TestBed.get(StockorderService);
    expect(service).toBeTruthy();
  });
});
