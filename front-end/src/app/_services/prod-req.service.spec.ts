import { TestBed } from '@angular/core/testing';

import { ProdReqService } from './prod-req.service';

describe('ProdReqService', () => {
  let service: ProdReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
