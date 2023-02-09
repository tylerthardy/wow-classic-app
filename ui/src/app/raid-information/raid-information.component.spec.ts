import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidInformationComponent } from './raid-information.component';

describe('RaidInformationComponent', () => {
  let component: RaidInformationComponent;
  let fixture: ComponentFixture<RaidInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
