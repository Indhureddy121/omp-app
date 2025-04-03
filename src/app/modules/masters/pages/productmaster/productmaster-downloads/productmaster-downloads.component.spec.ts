import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductmasterDownloadsComponent } from './productmaster-downloads.component';

describe('ProductmasterDownloadsComponent', () => {
  let component: ProductmasterDownloadsComponent;
  let fixture: ComponentFixture<ProductmasterDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductmasterDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductmasterDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
