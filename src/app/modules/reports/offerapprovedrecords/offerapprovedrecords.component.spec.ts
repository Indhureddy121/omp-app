import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferapprovedrecordsComponent } from './offerapprovedrecords.component';

describe('OfferapprovedrecordsComponent', () => {
  let component: OfferapprovedrecordsComponent;
  let fixture: ComponentFixture<OfferapprovedrecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferapprovedrecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferapprovedrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
