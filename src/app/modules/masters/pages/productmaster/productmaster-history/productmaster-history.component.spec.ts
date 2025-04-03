import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductmasterHistoryComponent } from './productmaster-history.component';

describe('ProductmasterHistoryComponent', () => {
  let component: ProductmasterHistoryComponent;
  let fixture: ComponentFixture<ProductmasterHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductmasterHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductmasterHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
