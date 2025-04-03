import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenAssignmentComponent } from './screen-assignment.component';

describe('ScreenAssignmentComponent', () => {
  let component: ScreenAssignmentComponent;
  let fixture: ComponentFixture<ScreenAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
