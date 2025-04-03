import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceConfimationComponent } from './balance-confimation.component';

describe('BalanceConfimationComponent', () => {
  let component: BalanceConfimationComponent;
  let fixture: ComponentFixture<BalanceConfimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceConfimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceConfimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
