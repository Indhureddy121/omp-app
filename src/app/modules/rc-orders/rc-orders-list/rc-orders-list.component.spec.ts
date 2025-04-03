import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcOrdersListComponent } from './rc-orders-list.component';

describe('RcOrdersListComponent', () => {
  let component: RcOrdersListComponent;
  let fixture: ComponentFixture<RcOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
