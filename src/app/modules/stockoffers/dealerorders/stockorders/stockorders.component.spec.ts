import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockordersComponent } from './stockorders.component';

describe('StockordersComponent', () => {
  let component: StockordersComponent;
  let fixture: ComponentFixture<StockordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
