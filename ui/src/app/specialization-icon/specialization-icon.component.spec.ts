import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationIconComponent } from './specialization-icon.component';

describe('SpecializationIconComponent', () => {
  let component: SpecializationIconComponent;
  let fixture: ComponentFixture<SpecializationIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecializationIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
