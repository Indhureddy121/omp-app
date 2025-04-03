import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmasterstdListComponent } from './costmasterstd-list.component';

describe('CostmasterstdListComponent', () => {
  let component: CostmasterstdListComponent;
  let fixture: ComponentFixture<CostmasterstdListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostmasterstdListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmasterstdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
