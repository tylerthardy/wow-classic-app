import { TestBed } from '@angular/core/testing';

import { RegionServerService } from './region-server.service';

describe('RegionServerService', () => {
  let service: RegionServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
