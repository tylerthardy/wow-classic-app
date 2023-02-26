import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSelectionComponent } from './class-selection.component';

describe('ClassSelectionComponent', () => {
  let component: ClassSelectionComponent;
  let fixture: ComponentFixture<ClassSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
