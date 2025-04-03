import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenopportunityanalysisComponent } from './openopportunityanalysis.component';

describe('OpenopportunityanalysisComponent', () => {
  let component: OpenopportunityanalysisComponent;
  let fixture: ComponentFixture<OpenopportunityanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenopportunityanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenopportunityanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
