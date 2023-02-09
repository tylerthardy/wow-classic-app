import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidLeadHelperComponent } from './raid-lead-helper.component';

describe('RaidLeadHelperComponent', () => {
  let component: RaidLeadHelperComponent;
  let fixture: ComponentFixture<RaidLeadHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaidLeadHelperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RaidLeadHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
