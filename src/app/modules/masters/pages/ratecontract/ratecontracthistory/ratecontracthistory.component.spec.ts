import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatecontracthistoryComponent } from './ratecontracthistory.component';

describe('RatecontracthistoryComponent', () => {
  let component: RatecontracthistoryComponent;
  let fixture: ComponentFixture<RatecontracthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatecontracthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatecontracthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
