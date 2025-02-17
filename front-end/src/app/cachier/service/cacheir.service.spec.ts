import { TestBed } from '@angular/core/testing';

import { CacheirService } from './cacheir.service';

describe('CacheirService', () => {
  let service: CacheirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
