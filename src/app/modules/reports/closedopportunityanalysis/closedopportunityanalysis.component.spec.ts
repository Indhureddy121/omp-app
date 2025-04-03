import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedopportunityanalysisComponent } from './closedopportunityanalysis.component';

describe('ClosedopportunityanalysisComponent', () => {
  let component: ClosedopportunityanalysisComponent;
  let fixture: ComponentFixture<ClosedopportunityanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedopportunityanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedopportunityanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
