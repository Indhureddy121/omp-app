/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddRateContractsItemsPopupComponent } from './add-rate-contracts-items-popup.component';

describe('AddRateContractsItemsPopupComponent', () => {
  let component: AddRateContractsItemsPopupComponent;
  let fixture: ComponentFixture<AddRateContractsItemsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRateContractsItemsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRateContractsItemsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
