import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WowheadLinkComponent } from './wowhead-link.component';

describe('WowheadLinkComponent', () => {
  let component: WowheadLinkComponent;
  let fixture: ComponentFixture<WowheadLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WowheadLinkComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WowheadLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
