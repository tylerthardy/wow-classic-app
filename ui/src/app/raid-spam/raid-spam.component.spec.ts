import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidSpamComponent } from './raid-spam.component';

describe('RaidSpamComponent', () => {
  let component: RaidSpamComponent;
  let fixture: ComponentFixture<RaidSpamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaidSpamComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RaidSpamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
