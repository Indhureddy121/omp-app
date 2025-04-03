import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyforsoComponent } from './readyforso.component';

describe('ReadyforsoComponent', () => {
  let component: ReadyforsoComponent;
  let fixture: ComponentFixture<ReadyforsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyforsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyforsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
