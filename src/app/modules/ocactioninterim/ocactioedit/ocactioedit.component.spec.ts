import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcactioeditComponent } from './ocactioedit.component';

describe('OcactioeditComponent', () => {
  let component: OcactioeditComponent;
  let fixture: ComponentFixture<OcactioeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcactioeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcactioeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
