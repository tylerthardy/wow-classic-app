import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISpecializationDataComponent } from './specialization-data.component';

describe('ISpecializationDataComponent', () => {
  let component: ISpecializationDataComponent;
  let fixture: ComponentFixture<ISpecializationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ISpecializationDataComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ISpecializationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
