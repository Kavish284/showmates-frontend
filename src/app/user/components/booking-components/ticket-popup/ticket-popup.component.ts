// ticket-popup.component.ts
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ticket } from '../../../models/ticket';
import { Router } from '@angular/router';
import { Order } from '../../../models/order';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../../shared/services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EncryptionService } from '../../../../shared/services/encryption.service';

@Component({
  selector: 'app-ticket-popup',
  templateUrl: './ticket-popup.component.html',
  styleUrls: ['./ticket-popup.component.css']
})
export class TicketPopupComponent {
  @Input() tickets: Ticket[];
  @Input() eventId: string; // Pass the ticket data from parent component
  @Input() selectedDateTime: any;
  @Output() checkoutEvent = new EventEmitter<number>();
  totalQuantity: number = 0;
  order: Order;
  constructor(private toasterService: ToastrService, private encryptionService: EncryptionService, private orderService: OrderService, private router: Router, private modalService: NgbModal) {
    this.order = {
      eventId: '',
      userId: '',
      currency: '',
      totalPrice: 0,
      paymentStatus: '',
      bookingDate: undefined,
      tickets: [],
      tickerQrCode: '',
      ticketDate: undefined,
      seasonPassOrder: false,
      regularOrderId: undefined
    };

  }
  open(addticket) {
    this.modalService.open(addticket, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }
  closeTicketModel() {

    this.modalService.dismissAll();
  }
  calculateTotalAmount(): number {
    return this.tickets.reduce((total, ticket) => total + (ticket.quantity * ticket.ticketPrice), 0);
  }
  calculateTotalAmountDiff(tickets: Ticket[]): number {
    return tickets.reduce((total, ticket) => total + (ticket.quantity * ticket.ticketPrice), 0);
  }
  incrementQuantity(index: number) {

    if (this.tickets[index].quantity < 10 && (this.tickets[index].totalAvailableTickets - this.tickets[index].ticketsSold) > this.tickets[index].quantity) { // Limit to 10 tickets per type, adjust as needed
      this.tickets[index].quantity++;
      this.totalQuantity++;
    }
    else if (!(this.tickets[index].quantity < 10)) {
      this.toasterService.error("You cannot select more than 10 tickets at a time", "", { timeOut: 3000 });
    } else if (!((this.tickets[index].totalAvailableTickets - this.tickets[index].ticketsSold) > this.tickets[index].quantity)) {
      this.toasterService.error("No more tickets available!", "", { timeOut: 3000 });
    }
  }

  decrementQuantity(index: number) {
    if (this.tickets[index].quantity > 0) {
      this.tickets[index].quantity--;
      this.totalQuantity--;
    }
  }
  async checkout() {
    const date = new Date(this.selectedDateTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDateString = `${year}-${month}-${day}`;

    // Create a new Date object from the formatted string
    const formattedDate = new Date(formattedDateString);
    const totalAmount = this.calculateTotalAmount();
    const selectedTickets: Ticket[] = this.tickets.filter(ticket => ticket.quantity > 0);

    this.order.currency = "INR";
    this.order.eventId = this.eventId;
    this.order.ticketDate = formattedDate;
    //this.order.paymentStatus = 'pending';

    this.order.tickets = selectedTickets;

    this.order.totalPrice = totalAmount;
    this.order.userId = "";

    //stored data in session storage
    if (this.order) {

      //storing encrypted order data into session storage
      sessionStorage.removeItem("regularOrder");
      sessionStorage.removeItem("seasonOrder");
      this.encryptionService.encryptAndSessionStorage("data", this.order);
      this.closeTicketModel();
      this.router.navigate(['order-summary']);
    } else {
      this.closeTicketModel();
      this.toasterService.error("something went wrong,please try again later", "", { timeOut: 3000 });
    }
  }

}

