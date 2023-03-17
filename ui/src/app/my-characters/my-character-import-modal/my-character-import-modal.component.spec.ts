import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCharacterImportModalComponent } from './my-character-import-modal.component';

describe('MyCharacterImportModalComponent', () => {
  let component: MyCharacterImportModalComponent;
  let fixture: ComponentFixture<MyCharacterImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCharacterImportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCharacterImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
