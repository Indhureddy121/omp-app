import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsearchComponent } from './appsearch.component';

describe('AppsearchComponent', () => {
  let component: AppsearchComponent;
  let fixture: ComponentFixture<AppsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
