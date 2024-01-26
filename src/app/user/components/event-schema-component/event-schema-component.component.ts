import { Component,Inject,Input, Renderer2 } from '@angular/core';
import { Event } from '../../models/event';
import { DOCUMENT } from '@angular/common';
import { ipPath } from 'src/environments/environment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-event-schema-component',
  templateUrl: './event-schema-component.component.html',
  styleUrls: ['./event-schema-component.component.css']
})
export class EventSchemaComponent {

  ipPath=ipPath;
  performers=[];
  tickets=[];
  @Input() event: any; // Input property to receive event details
  
  constructor(private _renderer2: Renderer2,@Inject(DOCUMENT) private _document: Document) { }
  
  ngOnInit(){

    //for extracting artists
    if(this.event && this.event.eventArtists)
    this.event.eventArtists.forEach(artist => {
      // Check if the artist has a name property
      if (artist.eventArtistName) {
        // Push the name into the artistNames array
        this.performers.push(artist.eventArtistName);
      }
    });

     //for extracting artists
     if(this.event && this.event.eventDates)
     this.event.eventDates.forEach(date => {
       if (date.eventTicketTypes) {
         
         date.eventTicketTypes.forEach(ticket=>{
          ticket.validDate=moment(date.eventDate).format("YYYY-MM-DD");
          this.tickets.push(ticket);
         })
       }
     });

  }



  ngAfterViewInit() {
    
    let script = this._renderer2.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": this.event.eventTitle,
      "description": this.event.eventDescription,
      "image": ipPath+this.event.eventImages.eventBannerImage,
      "startDate": this.event.eventDates[0].eventDate,
      "endDate": this.event.eventDates[this.event.eventDates.length-1].eventDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "url":"https://showmates.in/event-details/"+this.event._id,
      "location": {		
        "@type": "Place",
        "name": this.event.eventLocation.eventVenue+" : Ahmedabad",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": this.event.eventLocation.eventAddress,
          "addressLocality": "Ahmedabad",
          "postalCode": this.event.eventLocation.eventPincode,
          "addressCountry": "IN"
        }
      },
      'performers': this.performers.map(performer => ({
        '@type': 'Person',
        'name': performer
      })),
      'offers': this.tickets.map(ticket => ({
        '@type': 'Offer',
        "name": ticket.ticketTitle,
        "price": ticket.ticketPrice,
        "priceCurrency": "INR",
        "validFrom": ticket.validDate,
        "url": "https://showmates.in/event-details/"+this.event._id,
        "availability": "https://schema.org/InStock",
        "inventoryLevel":{
          '@type': 'QuantitativeValue',
          'value' : ticket.totalAvailableTickets-ticket.ticketsSold
        }
      }))
      
    });

    this._renderer2.appendChild(this._document.body, script);
}
  generateSchema(): any {
    // Create dynamic JSON-LD structured data for the event
    const eventSchema = {
      '@context': 'http://schema.org',
      '@type': 'Event',
      'name': this.event.eventTitle,
      'description': this.event.eventDescription,
      'startDate': this.event.eventStartDate.getDate,
      'endDate': this.event.eventEndDate.getDate,
      'location': {
        '@type': 'Place',
        'name': this.event.eventLocation,
      },
    };

    return eventSchema;
  }
}