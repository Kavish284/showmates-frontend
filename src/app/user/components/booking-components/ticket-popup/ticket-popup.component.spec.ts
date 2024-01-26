import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPopupComponent } from './ticket-popup.component';

describe('TicketPopupComponent', () => {
  let component: TicketPopupComponent;
  let fixture: ComponentFixture<TicketPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
