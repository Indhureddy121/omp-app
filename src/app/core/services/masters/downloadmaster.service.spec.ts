import { TestBed } from '@angular/core/testing';

import { DownloadmasterService } from './downloadmaster.service';

describe('DownloadmasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadmasterService = TestBed.get(DownloadmasterService);
    expect(service).toBeTruthy();
  });
});
