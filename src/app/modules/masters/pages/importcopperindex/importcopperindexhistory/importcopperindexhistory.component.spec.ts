import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportcopperindexhistoryComponent } from './importcopperindexhistory.component';

describe('ImportcopperindexhistoryComponent', () => {
  let component: ImportcopperindexhistoryComponent;
  let fixture: ComponentFixture<ImportcopperindexhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportcopperindexhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportcopperindexhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
