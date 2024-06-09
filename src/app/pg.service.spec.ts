import { TestBed } from '@angular/core/testing';

import { PGService } from './pg.service';

describe('PGService', () => {
  let service: PGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
