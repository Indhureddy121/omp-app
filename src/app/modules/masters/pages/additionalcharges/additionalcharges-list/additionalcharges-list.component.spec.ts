import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalchargesListComponent } from './additionalcharges-list.component';

describe('AdditionalchargesListComponent', () => {
  let component: AdditionalchargesListComponent;
  let fixture: ComponentFixture<AdditionalchargesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalchargesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalchargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
