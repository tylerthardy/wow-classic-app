import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftresManagerComponent } from './softres-manager.component';

describe('RaidLeadHelperComponent', () => {
  let component: SoftresManagerComponent;
  let fixture: ComponentFixture<SoftresManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftresManagerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SoftresManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
