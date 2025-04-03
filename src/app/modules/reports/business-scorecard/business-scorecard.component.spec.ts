import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessScorecardComponent } from './business-scorecard.component';

describe('BusinessScorecardComponent', () => {
  let component: BusinessScorecardComponent;
  let fixture: ComponentFixture<BusinessScorecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessScorecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
