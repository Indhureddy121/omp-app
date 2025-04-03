import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleValidityComponent } from './article-validity.component';

describe('ArticleValidityComponent', () => {
  let component: ArticleValidityComponent;
  let fixture: ComponentFixture<ArticleValidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleValidityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
