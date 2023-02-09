import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoaRaidBuilderComponent } from './voa-raid-builder.component';

describe('VoaRaidBuilderComponent', () => {
  let component: VoaRaidBuilderComponent;
  let fixture: ComponentFixture<VoaRaidBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoaRaidBuilderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VoaRaidBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
