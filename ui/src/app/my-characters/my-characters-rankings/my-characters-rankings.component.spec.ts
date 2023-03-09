import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCharactersRankingsComponent } from './my-characters-rankings.component';

describe('MyCharactersRankingsComponent', () => {
  let component: MyCharactersRankingsComponent;
  let fixture: ComponentFixture<MyCharactersRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCharactersRankingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCharactersRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
