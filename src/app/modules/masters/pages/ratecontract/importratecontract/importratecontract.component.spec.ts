import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportratecontractComponent } from './importratecontract.component';

describe('ImportratecontractComponent', () => {
  let component: ImportratecontractComponent;
  let fixture: ComponentFixture<ImportratecontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportratecontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportratecontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
