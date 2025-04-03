import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmasterstdHistoryComponent } from './costmasterstd-history.component';

describe('CostmasterstdHistoryComponent', () => {
  let component: CostmasterstdHistoryComponent;
  let fixture: ComponentFixture<CostmasterstdHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmasterstdHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmasterstdHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
