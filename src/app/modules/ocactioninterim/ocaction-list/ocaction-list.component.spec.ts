import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcactionListComponent } from './ocaction-list.component';

describe('OcactionListComponent', () => {
  let component: OcactionListComponent;
  let fixture: ComponentFixture<OcactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
