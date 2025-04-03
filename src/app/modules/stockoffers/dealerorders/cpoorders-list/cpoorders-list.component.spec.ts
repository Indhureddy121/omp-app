import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpoordersListComponent } from './cpoorders-list.component';

describe('CpoordersListComponent', () => {
  let component: CpoordersListComponent;
  let fixture: ComponentFixture<CpoordersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpoordersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpoordersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
