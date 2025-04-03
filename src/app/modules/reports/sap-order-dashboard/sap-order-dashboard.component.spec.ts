import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SapOrderDashboardComponent } from './sap-order-dashboard.component';

describe('SapOrderDashboardComponent', () => {
  let component: SapOrderDashboardComponent;
  let fixture: ComponentFixture<SapOrderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SapOrderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapOrderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
