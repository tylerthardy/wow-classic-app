import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseNumberComponent } from './parse-number.component';

describe('ParseNumberComponent', () => {
  let component: ParseNumberComponent;
  let fixture: ComponentFixture<ParseNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParseNumberComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ParseNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
