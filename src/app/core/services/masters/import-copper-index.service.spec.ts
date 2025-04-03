import { TestBed } from '@angular/core/testing';

import { ImportCopperIndexService } from './import-copper-index.service';

describe('ImportCopperIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportCopperIndexService = TestBed.get(ImportCopperIndexService);
    expect(service).toBeTruthy();
  });
});
