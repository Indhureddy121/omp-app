import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeactionListComponent } from './peaction-list.component';

describe('PeactionListComponent', () => {
  let component: PeactionListComponent;
  let fixture: ComponentFixture<PeactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
