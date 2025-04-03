import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSubmissinComponent } from './balance-submissin.component';

describe('BalanceSubmissinComponent', () => {
  let component: BalanceSubmissinComponent;
  let fixture: ComponentFixture<BalanceSubmissinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSubmissinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSubmissinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
