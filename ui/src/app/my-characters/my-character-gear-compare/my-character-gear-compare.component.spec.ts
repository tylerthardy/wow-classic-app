import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCharacterGearCompareComponent } from './my-character-gear-compare.component';

describe('MyCharacterGearCompareComponent', () => {
  let component: MyCharacterGearCompareComponent;
  let fixture: ComponentFixture<MyCharacterGearCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCharacterGearCompareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCharacterGearCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
