import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmastertrdListComponent } from './costmastertrd-list.component';

describe('CostmastertrdListComponent', () => {
  let component: CostmastertrdListComponent;
  let fixture: ComponentFixture<CostmastertrdListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmastertrdListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmastertrdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
