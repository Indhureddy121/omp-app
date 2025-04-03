import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimemeasurementNewtoApprovedComponent } from './timemeasurement-newto-approved.component';

describe('TimemeasurementNewtoApprovedComponent', () => {
  let component: TimemeasurementNewtoApprovedComponent;
  let fixture: ComponentFixture<TimemeasurementNewtoApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimemeasurementNewtoApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimemeasurementNewtoApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
