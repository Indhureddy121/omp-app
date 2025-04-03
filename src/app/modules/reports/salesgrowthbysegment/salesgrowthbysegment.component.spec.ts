import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesgrowthbysegmentComponent } from './salesgrowthbysegment.component';

describe('SalesgrowthbysegmentComponent', () => {
  let component: SalesgrowthbysegmentComponent;
  let fixture: ComponentFixture<SalesgrowthbysegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesgrowthbysegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesgrowthbysegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
