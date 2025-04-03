import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSimulatorComponent } from './offer-simulator.component';

describe('OfferSimulatorComponent', () => {
  let component: OfferSimulatorComponent;
  let fixture: ComponentFixture<OfferSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
