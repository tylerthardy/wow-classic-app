import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLockoutModalComponent } from './edit-lockout-modal.component';

describe('EditLockoutModalComponent', () => {
  let component: EditLockoutModalComponent;
  let fixture: ComponentFixture<EditLockoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLockoutModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLockoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
