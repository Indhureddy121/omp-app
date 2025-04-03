import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlpmasterListComponent } from './alpmaster-list.component';

describe('AlpmasterListComponent', () => {
  let component: AlpmasterListComponent;
  let fixture: ComponentFixture<AlpmasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlpmasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlpmasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
