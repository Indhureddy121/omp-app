/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TatReportComponent } from './tat-report.component';

describe('TatReportComponent', () => {
  let component: TatReportComponent;
  let fixture: ComponentFixture<TatReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TatReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
