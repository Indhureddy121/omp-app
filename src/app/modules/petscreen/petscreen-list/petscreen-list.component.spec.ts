/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PetscreenListComponent } from './petscreen-list.component';

describe('PetscreenListComponent', () => {
  let component: PetscreenListComponent;
  let fixture: ComponentFixture<PetscreenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetscreenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetscreenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
