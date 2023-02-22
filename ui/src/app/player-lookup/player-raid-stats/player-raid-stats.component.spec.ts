import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRaidStatsComponent } from './player-raid-stats.component';

describe('PlayerRaidStatsComponent', () => {
  let component: PlayerRaidStatsComponent;
  let fixture: ComponentFixture<PlayerRaidStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerRaidStatsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRaidStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
