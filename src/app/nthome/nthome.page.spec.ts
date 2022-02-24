import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NthomePage } from './nthome.page';

describe('NthomePage', () => {
  let component: NthomePage;
  let fixture: ComponentFixture<NthomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NthomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NthomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
