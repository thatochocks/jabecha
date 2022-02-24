import { TestBed } from '@angular/core/testing';

import { IapService } from './iap.service';

describe('IapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IapService = TestBed.get(IapService);
    expect(service).toBeTruthy();
  });
});
