import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockordersListComponent } from './stockorders-list.component';

describe('StockordersListComponent', () => {
  let component: StockordersListComponent;
  let fixture: ComponentFixture<StockordersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockordersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockordersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
