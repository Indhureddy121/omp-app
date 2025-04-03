import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeactionComponent } from './peaction.component';

describe('PeactionComponent', () => {
  let component: PeactionComponent;
  let fixture: ComponentFixture<PeactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
