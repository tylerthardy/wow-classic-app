import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidSizeSelectionComponent } from './raid-size-selection.component';

describe('RaidSizeSelectionComponent', () => {
  let component: RaidSizeSelectionComponent;
  let fixture: ComponentFixture<RaidSizeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidSizeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidSizeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
