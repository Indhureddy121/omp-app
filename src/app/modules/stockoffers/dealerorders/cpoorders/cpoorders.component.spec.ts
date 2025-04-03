import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpoordersComponent } from './cpoorders.component';

describe('CpoordersComponent', () => {
  let component: CpoordersComponent;
  let fixture: ComponentFixture<CpoordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpoordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpoordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
