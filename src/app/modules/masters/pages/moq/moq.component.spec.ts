import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoqComponent } from './moq.component';

describe('MoqComponent', () => {
  let component: MoqComponent;
  let fixture: ComponentFixture<MoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
