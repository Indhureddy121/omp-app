import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnmasterHistoryComponent } from './hsnmaster-history.component';

describe('HsnmasterHistoryComponent', () => {
  let component: HsnmasterHistoryComponent;
  let fixture: ComponentFixture<HsnmasterHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnmasterHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnmasterHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
