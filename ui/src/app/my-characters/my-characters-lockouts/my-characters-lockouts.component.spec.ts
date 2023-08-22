import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCharactersLockoutsComponent } from './my-characters-lockouts.component';

describe('MyCharactersLockoutsComponent', () => {
  let component: MyCharactersLockoutsComponent;
  let fixture: ComponentFixture<MyCharactersLockoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCharactersLockoutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCharactersLockoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
