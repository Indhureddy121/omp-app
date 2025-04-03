import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesgrowthbyphComponent } from './salesgrowthbyph.component';

describe('SalesgrowthbyphComponent', () => {
  let component: SalesgrowthbyphComponent;
  let fixture: ComponentFixture<SalesgrowthbyphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesgrowthbyphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesgrowthbyphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
