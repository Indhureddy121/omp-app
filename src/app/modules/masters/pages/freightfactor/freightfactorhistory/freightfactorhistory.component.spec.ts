import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightfactorhistoryComponent } from './freightfactorhistory.component';

describe('FreightfactorhistoryComponent', () => {
  let component: FreightfactorhistoryComponent;
  let fixture: ComponentFixture<FreightfactorhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightfactorhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightfactorhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
