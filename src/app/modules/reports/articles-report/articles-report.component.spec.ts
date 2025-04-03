import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesReportComponent } from './articles-report.component';

describe('ArticlesReportComponent', () => {
  let component: ArticlesReportComponent;
  let fixture: ComponentFixture<ArticlesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
