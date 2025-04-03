import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprofferstatComponent } from './sprofferstat.component';

describe('SprofferstatComponent', () => {
  let component: SprofferstatComponent;
  let fixture: ComponentFixture<SprofferstatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprofferstatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprofferstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
