import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSimulatorListComponent } from './offer-simulator-list.component';

describe('OfferSimulatorListComponent', () => {
  let component: OfferSimulatorListComponent;
  let fixture: ComponentFixture<OfferSimulatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSimulatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSimulatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
