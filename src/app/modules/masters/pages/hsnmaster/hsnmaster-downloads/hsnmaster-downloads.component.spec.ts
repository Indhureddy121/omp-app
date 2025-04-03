import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnmasterDownloadsComponent } from './hsnmaster-downloads.component';

describe('HsnmasterDownloadsComponent', () => {
  let component: HsnmasterDownloadsComponent;
  let fixture: ComponentFixture<HsnmasterDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnmasterDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnmasterDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
