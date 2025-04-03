import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmactionComponent } from './fmaction.component';

describe('FmactionComponent', () => {
  let component: FmactionComponent;
  let fixture: ComponentFixture<FmactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
