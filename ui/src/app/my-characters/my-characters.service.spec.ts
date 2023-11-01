import { TestBed } from '@angular/core/testing';

import { MyCharactersService } from './my-characters.service';

describe('MyCharactersService', () => {
  let service: MyCharactersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCharactersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
