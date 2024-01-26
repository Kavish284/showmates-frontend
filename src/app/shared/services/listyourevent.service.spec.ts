import { TestBed } from '@angular/core/testing';

import { ListyoureventService } from './listyourevent.service';

describe('ListyoureventService', () => {
  let service: ListyoureventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListyoureventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
