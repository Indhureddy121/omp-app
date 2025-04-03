import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportfreightfactorComponent } from './importfreightfactor.component';

describe('ImportfreightfactorComponent', () => {
  let component: ImportfreightfactorComponent;
  let fixture: ComponentFixture<ImportfreightfactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportfreightfactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportfreightfactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
