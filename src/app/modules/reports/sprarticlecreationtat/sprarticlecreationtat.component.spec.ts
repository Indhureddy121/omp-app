import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprarticlecreationtatComponent } from './sprarticlecreationtat.component';

describe('SprarticlecreationtatComponent', () => {
  let component: SprarticlecreationtatComponent;
  let fixture: ComponentFixture<SprarticlecreationtatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprarticlecreationtatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprarticlecreationtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
