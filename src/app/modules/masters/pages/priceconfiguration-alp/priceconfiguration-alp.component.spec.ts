import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceconfigurationAlpComponent } from './priceconfiguration-alp.component';

describe('PriceconfigurationAlpComponent', () => {
  let component: PriceconfigurationAlpComponent;
  let fixture: ComponentFixture<PriceconfigurationAlpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceconfigurationAlpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceconfigurationAlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
