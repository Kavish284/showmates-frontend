// order-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../shared/services/order.service';
import { EventService } from '../../../../shared/services/event.service';
import { TicketTypeService } from '../../../../shared/services/ticket-type.service';
import { Profile } from 'src/app/user/models/profile';
import { SessionService } from '../../../../shared/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { ipPath } from 'src/environments/environment';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { PromocodeService } from 'src/app/shared/services/promocode.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  totalAmount: string;
  regularTotalAmount: string;
  seasonTotalAmount: string;
  count: number;
  regularCount = 0;
  seasonCount = 0;
  eventTitle: string;

  mobileNumber: string;
  email: string;
  merchantTransactionId: string;
  eventData;
  startTime;
  ticketData: any[] = [];
  regularTicketData: any[] = [];
  seasonTicketData: any[] = [];
  order;
  regularOrder;
  seasonOrder;
  totalCount = 0;
  profile: any;
  dataInitialized = false;
  availablePromocodes = [];
  appliedPromocodes = [];
  isPromocodeApplied: boolean = false;
  isticketsDataSet = false;
  eventDateTime: any;
 eventId="656e328679c5cad1b55846e5";
//eventId="656dc606ba6bff8437445b84";

  dayNameMapping = {
    'Sunday': 'Sun',
    'Monday': 'Mon',
    'Tuesday': 'Tues',
    'Wednesday': 'Wed',
    'Thursday': 'Thurs',
    'Friday': 'Fri',
    'Saturday': 'Sat'
  };

  constructor(private sessionService: SessionService, private promocodeService: PromocodeService, private encryptionService: EncryptionService, private toasterService: ToastrService, private router: Router, private ticketService: TicketTypeService, private route: ActivatedRoute, private eventService: EventService, private orderService: OrderService) {
    if (this.sessionService.isLoggedIn()) {
      const userId = localStorage.getItem("id");

      this.sessionService.getUserById(userId).subscribe((observer) => {
        if (observer.statusCode == 200) {
          this.profile = observer.data;
          this.mobileNumber = this.profile.phone;

        } else {
          this.profile = null;
        }
      })
    }
  }

  ngOnInit() {

    const value = this.encryptionService.decryptAndGetFromSessionStorage("data");
    // const regularOrder = this.encryptionService.decryptAndGetFromSessionStorage("regularOrder");
    if (value) {
      this.order = value;

      // Check if the order was successful
      if (this.order) {

        this.eventService.getEventByid(this.order.eventId).subscribe((observer) => {
          if (observer.statusCode == 200) {
            this.eventData = observer.data;
            
            this.dataInitialized = true;
            this.startTime = this.eventData.eventDates.find((item) => item.eventDate === this.order.ticketDate);
           
            
          }   
        })
        
        // Convert the UTC date to IST using Moment.js
        const dayName = moment(this.order.ticketDate).tz('Asia/Kolkata').format('dddd');
        const formattedDay = this.dayNameMapping[dayName];
      
        this.eventDateTime = moment(this.order.ticketDate).tz('Asia/Kolkata').format(`, DD MMM, YYYY `);
        this.eventDateTime = formattedDay + this.eventDateTime;

        


        const ticketRequests = [];

        for (let index = 0; index < this.order.tickets.length; index++) {
          ticketRequests.push(this.ticketService.getTicketsById(this.order.tickets[index]._id));
        }

        forkJoin(ticketRequests).subscribe((responses: { statusCode: any; data: any }[]) => {
          responses.forEach((ticketData, index) => {
            if (ticketData.statusCode == 200) {

              this.ticketData[index] = {
                ticket: ticketData.data,
                quantity: this.order.tickets[index].quantity
              };
              this.totalCount += this.order.tickets[index].quantity;

            }
          });

          this.ticketData = this.ticketData.filter(item => item.quantity > 0);
          this.isticketsDataSet = this.ticketData.length == this.order.tickets.length;
        });

        //getting promocode data
        for (let ticket of this.order.tickets) {
          for (let promocode of ticket.promoCodes) {
            this.promocodeService.getPromocodeById(promocode).subscribe((observer) => {

              if (observer.statusCode == 200) {
                if (observer.data?.length != 0)
                  this.availablePromocodes.push(observer.data[0]);
              } else {
                //handle error here
              }
            })
          }
        }


        this.totalAmount = this.order.totalPrice;
        this.count = this.order.tickets.length;


      }

    }

    else {
      // Handle the case where the order was not successful
      this.toasterService.error("something went wrong,please try again later!");
      this.router.navigate([""]);
    }


  }

  //preventing check for promocode before login
  keepItUnchecked(checkbox) {
    checkbox.removeAttribute('checked'); // Remove the 'checked' attribute
  }

  changeOrderSummary(promocode: any) {
    let orderPrice = 0;
    if (this.profile?.promocodesUsed.includes(promocode._id))
      this.toasterService.error("you have already used this promocode!", "", { timeOut: 3000 });
    else {

      if (this.order) {
        for (let ticket of this.ticketData) {
          for (let pcode of ticket.ticket.promoCodes) {

            //if promocode selected by user is matching available promocodes for tickets
            if (promocode._id == pcode) {

              if (!this.appliedPromocodes.includes(promocode._id)) {
                ticket.ticket.originalPrice = ticket.ticket.ticketPrice
                this.appliedPromocodes.push(promocode._id)
                ticket.ticket.ticketPrice = ticket.ticket.ticketPrice - promocode.value
                this.isPromocodeApplied = true;


              } else if (this.appliedPromocodes.includes(promocode._id)) {
                let index = -1;
                index = this.appliedPromocodes.findIndex(id => id == promocode._id);

                if (index !== -1) {
                  this.appliedPromocodes.splice(index, 1); // Remove the item at the specified index
                }
                ticket.ticket.ticketPrice = ticket.ticket.ticketPrice + promocode.value
                //for making applied promocodes price
                if (this.appliedPromocodes.length <= 0)
                  this.isPromocodeApplied = false
              }

              //setting up this.order
              for (let orderTicket of this.order.tickets) {
                if (orderTicket._id == ticket.ticket._id) {
                  orderTicket.originalPrice = ticket.ticket.originalPrice
                  orderTicket.ticketPrice = ticket.ticket.ticketPrice
                }
              }
            }
          }

          orderPrice = orderPrice + ticket.ticket.ticketPrice * ticket.quantity;
          this.order.totalPrice = orderPrice
          this.totalAmount = this.order.totalPrice
        }
      } else if (1) {
        //handle season order
      }

    }

  }

  async initOrder() {
    if (this.profile.role == 'customer') {

      //normal order
      if (this.order) {

        //normal order with free event or zero(0) price
        //not sending this so that we single user can use this qr code multiple times
        //this.order.appliedPromocodes=this.appliedPromocodes;
        if (this.order.totalPrice == 0) {

          this.order.userId = this.profile._id;
          await this.orderService.intilizeOrder(this.order).subscribe(async (observer) => {
            if (observer.statusCode == 200) {
      
              //success  
              sessionStorage.clear();
              //passed order id
              await this.orderService.paymentSuccesForFreeEvents(observer.data._id).subscribe((observerForFree) => {
             
                if (observerForFree.statusCode == 200) {
                  this.toasterService.success("See your tickets here", "", { timeOut: 3000 });
                  this.router.navigate(["tickets"]);
                } else {
                  this.toasterService.error(observerForFree.message, "", { timeOut: 3000 });
                  this.router.navigate([""]);
                }
              });

            } else {
              this.toasterService.error(observer.message, "", { timeOut: 3000 });
            }

          })
        } else {

          //normal order with price greater than zero(0)
          this.order.userId = this.profile._id;

          await this.orderService.intilizeOrder(this.order).subscribe(async (observer) => {
            //init order sending to db

            if (observer.statusCode == 200) {
              //success  
              sessionStorage.clear();
              //opening fonpe
              this.openNewWindowWithParams(observer.data);
            } else {
              this.toasterService.error(observer.message, "", { timeOut: 3000 });
            }

          })
        }

      }
    } else {
      this.toasterService.error("please login with user account!", "", { timeOut: 3000 });
    }

  }

  openNewWindowWithParams(phonepeDataWithUrl: any): void {

    // Use window.open to open a new browser window or tab
    window.open(phonepeDataWithUrl, '_self');
  }
}
