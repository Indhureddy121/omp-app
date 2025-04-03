import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnmasterListComponent } from './hsnmaster-list.component';

describe('HsnmasterListComponent', () => {
  let component: HsnmasterListComponent;
  let fixture: ComponentFixture<HsnmasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnmasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnmasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
