import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalMatrixComponent } from './approval-matrix.component';

describe('ApprovalMatrixComponent', () => {
  let component: ApprovalMatrixComponent;
  let fixture: ComponentFixture<ApprovalMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
