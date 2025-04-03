import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmcosthistoryComponent } from './rmcosthistory.component';

describe('RmcosthistoryComponent', () => {
  let component: RmcosthistoryComponent;
  let fixture: ComponentFixture<RmcosthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmcosthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmcosthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
