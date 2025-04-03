import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsmactionComponent } from './asmaction.component';

describe('AsmactionComponent', () => {
  let component: AsmactionComponent;
  let fixture: ComponentFixture<AsmactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsmactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsmactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
