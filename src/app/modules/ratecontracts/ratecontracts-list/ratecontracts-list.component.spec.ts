/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RatecontractsListComponent } from './ratecontracts-list.component';

describe('RatecontractsListComponent', () => {
  let component: RatecontractsListComponent;
  let fixture: ComponentFixture<RatecontractsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatecontractsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatecontractsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
