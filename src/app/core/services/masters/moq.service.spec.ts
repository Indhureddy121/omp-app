import { TestBed } from '@angular/core/testing';

import { MoqService } from './moq.service';

describe('MoqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoqService = TestBed.get(MoqService);
    expect(service).toBeTruthy();
  });
});
