import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WclLinkIconComponent } from './wcl-link-icon.component';

describe('WclLinkIconComponent', () => {
  let component: WclLinkIconComponent;
  let fixture: ComponentFixture<WclLinkIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WclLinkIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WclLinkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
