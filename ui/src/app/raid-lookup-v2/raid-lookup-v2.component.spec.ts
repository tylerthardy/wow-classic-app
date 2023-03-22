import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidLookupV2Component } from './raid-lookup-v2.component';

describe('RaidLookupV2Component', () => {
  let component: RaidLookupV2Component;
  let fixture: ComponentFixture<RaidLookupV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidLookupV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidLookupV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
