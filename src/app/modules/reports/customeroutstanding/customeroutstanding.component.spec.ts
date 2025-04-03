import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeroutstandingComponent } from './customeroutstanding.component';

describe('CustomeroutstandingComponent', () => {
  let component: CustomeroutstandingComponent;
  let fixture: ComponentFixture<CustomeroutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeroutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeroutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
