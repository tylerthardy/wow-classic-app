import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerComparisonComponent } from './player-comparison.component';

describe('PlayerComparisonComponent', () => {
  let component: PlayerComparisonComponent;
  let fixture: ComponentFixture<PlayerComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerComparisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
