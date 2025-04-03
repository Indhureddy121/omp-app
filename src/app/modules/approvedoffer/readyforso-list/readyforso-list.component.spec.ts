import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyforsoListComponent } from './readyforso-list.component';

describe('ReadyforsoListComponent', () => {
  let component: ReadyforsoListComponent;
  let fixture: ComponentFixture<ReadyforsoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyforsoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyforsoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
