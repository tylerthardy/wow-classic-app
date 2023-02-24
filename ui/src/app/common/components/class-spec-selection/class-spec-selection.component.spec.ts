import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSpecSelectionComponent } from './class-spec-selection.component';

describe('ClassSpecSelectionComponent', () => {
  let component: ClassSpecSelectionComponent;
  let fixture: ComponentFixture<ClassSpecSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSpecSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSpecSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
