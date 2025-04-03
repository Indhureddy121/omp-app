import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListSubHeaderComponent } from './app-list-sub-header.component';

describe('AppListSubHeaderComponent', () => {
  let component: AppListSubHeaderComponent;
  let fixture: ComponentFixture<AppListSubHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppListSubHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
