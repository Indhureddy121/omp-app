import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmastertrdDownloadsComponent } from './costmastertrd-downloads.component';

describe('CostmastertrdDownloadsComponent', () => {
  let component: CostmastertrdDownloadsComponent;
  let fixture: ComponentFixture<CostmastertrdDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmastertrdDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmastertrdDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
