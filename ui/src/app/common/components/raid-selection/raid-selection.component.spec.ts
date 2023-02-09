import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidSelectionComponent } from './raid-selection.component';

describe('RaidSelectionComponent', () => {
  let component: RaidSelectionComponent;
  let fixture: ComponentFixture<RaidSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaidSelectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RaidSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
