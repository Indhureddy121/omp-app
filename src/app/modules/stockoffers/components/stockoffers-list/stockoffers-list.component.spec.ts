import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoffersListComponent } from './stockoffers-list.component';

describe('StockoffersListComponent', () => {
  let component: StockoffersListComponent;
  let fixture: ComponentFixture<StockoffersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockoffersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
