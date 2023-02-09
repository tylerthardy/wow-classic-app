import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationDataComponent } from './specialization-data.component';

describe('SpecializationDataComponent', () => {
  let component: SpecializationDataComponent;
  let fixture: ComponentFixture<SpecializationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecializationDataComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
