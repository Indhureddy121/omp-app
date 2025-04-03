import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdsprarticlescountComponent } from './stdsprarticlescount.component';

describe('StdsprarticlescountComponent', () => {
  let component: StdsprarticlescountComponent;
  let fixture: ComponentFixture<StdsprarticlescountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdsprarticlescountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdsprarticlescountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
