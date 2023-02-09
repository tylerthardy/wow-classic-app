import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildLogsSummaryComponent } from './guild-logs-summary.component';

describe('GuildLogsSummaryComponent', () => {
  let component: GuildLogsSummaryComponent;
  let fixture: ComponentFixture<GuildLogsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuildLogsSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GuildLogsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
