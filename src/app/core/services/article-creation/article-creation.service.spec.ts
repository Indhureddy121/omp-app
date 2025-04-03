import { TestBed } from '@angular/core/testing';

import { ArticleCreationService } from './article-creation.service';

describe('ArticleCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticleCreationService = TestBed.get(ArticleCreationService);
    expect(service).toBeTruthy();
  });
});
