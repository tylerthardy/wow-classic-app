import { TestBed } from '@angular/core/testing';

import { SoftresService } from './softres.service';

describe('SoftresService', () => {
  let service: SoftresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
