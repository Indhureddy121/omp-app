import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCreationListComponent } from './article-creation-list.component';

describe('ArticleCreationListComponent', () => {
  let component: ArticleCreationListComponent;
  let fixture: ComponentFixture<ArticleCreationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCreationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCreationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
