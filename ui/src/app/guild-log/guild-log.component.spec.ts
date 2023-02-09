import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildLogComponent } from './guild-log.component';

describe('GuildLogComponent', () => {
  let component: GuildLogComponent;
  let fixture: ComponentFixture<GuildLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuildLogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GuildLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
