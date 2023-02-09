import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoftresModalComponent } from './create-softres-modal.component';

describe('CreateSoftresModalComponent', () => {
  let component: CreateSoftresModalComponent;
  let fixture: ComponentFixture<CreateSoftresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSoftresModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSoftresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
