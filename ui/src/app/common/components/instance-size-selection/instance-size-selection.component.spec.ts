import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceSizeSelectionComponent } from './instance-size-selection.component';

describe('InstanceSizeSelectionComponent', () => {
  let component: InstanceSizeSelectionComponent;
  let fixture: ComponentFixture<InstanceSizeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceSizeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstanceSizeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
