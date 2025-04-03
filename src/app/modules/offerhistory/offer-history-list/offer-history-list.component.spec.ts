import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferHistoryListComponent } from './offer-history-list.component';

describe('OfferHistoryListComponent', () => {
  let component: OfferHistoryListComponent;
  let fixture: ComponentFixture<OfferHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
