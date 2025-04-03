import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePriceComponent } from './article-price.component';

describe('ArticlePriceComponent', () => {
  let component: ArticlePriceComponent;
  let fixture: ComponentFixture<ArticlePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
