import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsmactionListComponent } from './asmaction-list.component';

describe('AsmactionListComponent', () => {
  let component: AsmactionListComponent;
  let fixture: ComponentFixture<AsmactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsmactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsmactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
