import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLookupComponent } from './player-lookup.component';

describe('PlayerLookupComponent', () => {
  let component: PlayerLookupComponent;
  let fixture: ComponentFixture<PlayerLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerLookupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
