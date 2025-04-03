import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmactionListComponent } from './fmaction-list.component';

describe('FmactionListComponent', () => {
  let component: FmactionListComponent;
  let fixture: ComponentFixture<FmactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
