import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlpmasterHistoryComponent } from './alpmaster-history.component';

describe('AlpmasterHistoryComponent', () => {
  let component: AlpmasterHistoryComponent;
  let fixture: ComponentFixture<AlpmasterHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlpmasterHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlpmasterHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
