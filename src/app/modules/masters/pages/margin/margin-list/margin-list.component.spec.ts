import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginListComponent } from './margin-list.component';

describe('MarginListComponent', () => {
  let component: MarginListComponent;
  let fixture: ComponentFixture<MarginListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
