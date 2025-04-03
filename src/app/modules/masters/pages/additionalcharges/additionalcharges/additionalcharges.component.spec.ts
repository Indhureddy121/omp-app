import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalchargesComponent } from './additionalcharges.component';

describe('AdditionalchargesComponent', () => {
  let component: AdditionalchargesComponent;
  let fixture: ComponentFixture<AdditionalchargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalchargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
