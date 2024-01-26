import { TestBed } from '@angular/core/testing';

import { TicketTypeService } from './ticket-type.service';

describe('TicketTypeService', () => {
  let service: TicketTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
