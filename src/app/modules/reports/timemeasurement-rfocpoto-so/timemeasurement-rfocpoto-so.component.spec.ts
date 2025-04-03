import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimemeasurementRFOCPOtoSOComponent } from './timemeasurement-rfocpoto-so.component';

describe('TimemeasurementRFOCPOtoSOComponent', () => {
  let component: TimemeasurementRFOCPOtoSOComponent;
  let fixture: ComponentFixture<TimemeasurementRFOCPOtoSOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimemeasurementRFOCPOtoSOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimemeasurementRFOCPOtoSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
