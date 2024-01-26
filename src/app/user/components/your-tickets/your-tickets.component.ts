import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { EventService } from '../../../shared/services/event.service';
import { forkJoin } from 'rxjs';
import { ipPath } from 'src/environments/environment';
import { SessionService } from '../../../shared/services/session.service';
import { Profile } from '../../models/profile';
import { EncryptionService } from '../../../shared/services/encryption.service';
@Component({
  selector: 'app-your-tickets',
  templateUrl: './your-tickets.component.html',
  styleUrls: ['./your-tickets.component.css']
})
export class YourTicketsComponent {

  ipPath = ipPath;
  order;
  previousOrder;
  mobile: boolean = false;
  opened: boolean = false;
  eventData: any[] = [];
  profile: Profile;
  orderWithEvent: any[] = [];
  orderWithEventAllowedPerson:any[]=[];
  previousOrders: any[] = [];
  previoudOrdersAllowedPersons:any[]=[];
  constructor(private sessionService: SessionService, private encryptionService: EncryptionService, private http: HttpClient, private orderService: OrderService, private eventService: EventService) {
    if (this.sessionService.isLoggedIn()) {
      const userId = localStorage.getItem("id");
   
      this.sessionService.getUserById(userId).subscribe((observer) => {
        if (observer.statusCode == 200) {
          this.profile = observer.data;
          this.orderService.getOrderByUserId(this.profile._id).subscribe((observer) => {
            this.order = observer.data;


            const observables = [];
            this.order.forEach((order) => {
              observables.push(
                this.eventService.getEventByid(order.eventId._id)
              );
            });

            forkJoin(observables).subscribe((events) => {
              events.forEach((event, index) => {
                if (event.statusCode == 200) {
                  this.eventData.push(event.data);
                }
              })

              for (let i = 0; i < this.order.length; i++) {

                const orderImage = this.ipPath.substring(0, this.ipPath.length - 1) + this.eventData[i]?.eventImages.eventCardImage.replace(/\\/g, '/').replace(/(\.\.)+/g, '')
                const combinedObject = { ...this.eventData[i], ...this.order[i], orderImage: orderImage };
                this.orderWithEvent.push(combinedObject);
                
              }
            });
          });
          this.orderService.getPreviousOrderByUserId(this.profile._id).subscribe((observer) => {
            this.previousOrder = observer.data;


            const observables = [];
            this.previousOrder.forEach((previousOrder) => {
              observables.push(
                this.eventService.getEventByid(previousOrder.eventId._id)
              );
            });

            forkJoin(observables).subscribe((events) => {
              events.forEach((event, index) => {
                if (event.statusCode == 200) {
                  this.eventData.push(event.data);
                }
              })

              for (let i = 0; i < this.previousOrder.length; i++) {

                const orderImage = this.ipPath.substring(0, this.ipPath.length - 1) + this.eventData[i]?.eventImages.eventCardImage.replace(/\\/g, '/').replace(/(\.\.)+/g, '')
                const combinedObject = { ...this.eventData[i], ...this.previousOrder[i], orderImage: orderImage };
                this.previousOrders.push(combinedObject);
              }
            });
          });
        } else {
          this.profile = null;
        }
      })
    }
    this.checkViewportWidth();
  }
  checkViewportWidth() {
    if (window.innerWidth <= 768) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
  ngOnInit() {

  }
  toggleRight() {
    this.opened = !this.opened;
  }
  converted(imageUrl) {
    return imageUrl.replace(/\\/g, '/').replace(/(\.\.)+/g, '');
  }
  getCount(tickets) {
    let count = 0;
    
    tickets.map((ticket) => {
      count += ticket.ticket.allowedPerson * ticket.quantity;
    })
    return count;
  }
  getDayOfWeek(dateString) {
    const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const date = new Date(dateString);
    const dayIndex = date.getDay(); // This returns an index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    return daysOfWeek[dayIndex];
  }
  convertDateFormat(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const monthIndex = date.getMonth();
    const day = date.getDate();

    const formattedDate = `${monthNames[monthIndex]} ${day}`;
    return formattedDate;
  }
  getEventStartTime(events, targetDate) {
    const event = events.find((e) => {
      // Extract the date part from the eventDate in yyyy-mm-dd format
      const eventDate = e.eventDate.split('T')[0];
      return eventDate === targetDate;
    });

    return event ? event.eventStartTime : null;
  }
  getEventEndTime(events, targetDate) {
    const event = events.find((e) => {
      // Extract the date part from the eventDate in yyyy-mm-dd format
      const eventDate = e.eventDate.split('T')[0];
      return eventDate === targetDate;
    });

    return event ? event.eventEndTime : null;
  }
  numberToWords(number) {
    const ones = [
      "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"
    ];

    const teens = [
      "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
    ];

    const tens = [
      "ZERO", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
    ];

    if (number >= 0 && number <= 9) {
      return ones[number];
    } else if (number >= 10 && number <= 19) {
      return teens[number - 10];
    } else if (number >= 20 && number <= 99) {
      const tensDigit = Math.floor(number / 10);
      const onesDigit = number % 10;
      return tens[tensDigit] + (onesDigit > 0 ? " " + ones[onesDigit] : "");
    } else if (number === 100) {
      return "ONE HUNDRED";
    } else {
      return "Number out of range";
    }
  }


}
