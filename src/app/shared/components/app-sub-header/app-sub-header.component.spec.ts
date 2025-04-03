import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSubHeaderComponent } from './app-sub-header.component';

describe('AppSubHeaderComponent', () => {
  let component: AppSubHeaderComponent;
  let fixture: ComponentFixture<AppSubHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSubHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
