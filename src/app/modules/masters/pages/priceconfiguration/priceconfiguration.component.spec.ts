import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceconfigurationComponent } from './priceconfiguration.component';

describe('PriceconfigurationComponent', () => {
  let component: PriceconfigurationComponent;
  let fixture: ComponentFixture<PriceconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
