import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportcopperindexComponent } from './importcopperindex.component';

describe('ImportcopperindexComponent', () => {
  let component: ImportcopperindexComponent;
  let fixture: ComponentFixture<ImportcopperindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportcopperindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportcopperindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
