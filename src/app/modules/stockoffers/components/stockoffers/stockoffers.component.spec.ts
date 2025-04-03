import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoffersComponent } from './stockoffers.component';

describe('StockoffersComponent', () => {
  let component: StockoffersComponent;
  let fixture: ComponentFixture<StockoffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockoffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
