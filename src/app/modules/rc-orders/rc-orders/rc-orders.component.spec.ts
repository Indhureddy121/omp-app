import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcOrdersComponent } from './rc-orders.component';

describe('RcOrdersComponent', () => {
  let component: RcOrdersComponent;
  let fixture: ComponentFixture<RcOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
