import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmastertrdHistoryComponent } from './costmastertrd-history.component';

describe('CostmastertrdHistoryComponent', () => {
  let component: CostmastertrdHistoryComponent;
  let fixture: ComponentFixture<CostmastertrdHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmastertrdHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmastertrdHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
