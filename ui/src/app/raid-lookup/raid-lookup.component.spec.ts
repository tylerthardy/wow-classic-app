import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidLookupComponent } from './raid-lookup.component';

describe('RaidLookupComponent', () => {
  let component: RaidLookupComponent;
  let fixture: ComponentFixture<RaidLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaidLookupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RaidLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
