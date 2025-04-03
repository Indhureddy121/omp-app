import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginHistoryComponent } from './margin-history.component';

describe('MarginHistoryComponent', () => {
  let component: MarginHistoryComponent;
  let fixture: ComponentFixture<MarginHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
