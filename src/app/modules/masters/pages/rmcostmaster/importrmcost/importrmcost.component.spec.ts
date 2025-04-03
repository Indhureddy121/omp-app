import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportrmcostComponent } from './importrmcost.component';

describe('ImportrmcostComponent', () => {
  let component: ImportrmcostComponent;
  let fixture: ComponentFixture<ImportrmcostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportrmcostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportrmcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
