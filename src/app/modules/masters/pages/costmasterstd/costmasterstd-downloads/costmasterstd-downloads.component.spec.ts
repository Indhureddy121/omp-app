import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmasterstdDownloadsComponent } from './costmasterstd-downloads.component';

describe('CostmasterstdDownloadsComponent', () => {
  let component: CostmasterstdDownloadsComponent;
  let fixture: ComponentFixture<CostmasterstdDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmasterstdDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmasterstdDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
