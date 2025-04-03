import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductwiseenquirytrendyoyComponent } from './productwiseenquirytrendyoy.component';

describe('ProductwiseenquirytrendyoyComponent', () => {
  let component: ProductwiseenquirytrendyoyComponent;
  let fixture: ComponentFixture<ProductwiseenquirytrendyoyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductwiseenquirytrendyoyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductwiseenquirytrendyoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
