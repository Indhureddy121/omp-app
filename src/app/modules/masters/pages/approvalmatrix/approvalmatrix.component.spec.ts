import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalmatrixComponent } from './approvalmatrix.component';

describe('ApprovalmatrixComponent', () => {
  let component: ApprovalmatrixComponent;
  let fixture: ComponentFixture<ApprovalmatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalmatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
