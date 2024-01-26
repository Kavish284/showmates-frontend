import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventService } from '../../../shared/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../models/profile';
import { Event } from '../../models/event';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SessionService } from '../../../shared/services/session.service';
import { ipPath } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TicketPopupComponent } from '../booking-components/ticket-popup/ticket-popup.component';
import { Ticket } from '../../models/ticket';
import * as moment from 'moment';
import 'moment-timezone';
import { DatePipe, Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Meta } from '@angular/platform-browser';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { ImagePreloadingService } from 'src/app/shared/services/image-preloading.service';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css'],
  animations: [
    trigger('fillAnimation', [
      state('unfilled', style({
        transform: 'scale(1.3)',
      })),
      state('filled', style({
        transform: 'scale(1.3)',
      })),
      transition('unfilled <=> filled', animate('200ms ease-in')),
    ]),
  ],
})
export class EventDetailsComponent implements AfterViewInit, OnInit {
  /* @ViewChild('contents') contents: TemplateRef<any>; */
  @ViewChild('mybook') modalContent!: TemplateRef<any>;
  @ViewChild('mybookcal') mybookcal: any;

  ipPath = ipPath;
  shareModal: boolean = false;
  hasMapString: boolean = false;
  mobileView: boolean = false;
  currentDate: any = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
  currentDateForDetails: any;
  showTac = false;
  oscollapse = false;
  vlcollapse = false;
  linkcollapse = false;
  similarEventTicketPrice = [];
  eventTicketPrice = 0;
  eventStartTime;
  eventDuration;
  event;
  similarEvents: Array<any> = [];
  user: Profile = null;
  safeUrl: SafeResourceUrl = null;
  displayText: string = 'none';
  isBannerLoaded: boolean = false;
  months: string[] = ['JAN', "FEB", 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  customOptions: OwlOptions = {
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    loop: false,
    nav: true,
    smartSpeed: 500,
    autoHeight: true,
    autoplay: true,
    autoplayTimeout: 5000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2,
        margin: 20,
        dots: true,
        // navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
      },
      600: {
        items: 3,
        margin: 20
      },
      1024: {
        items: 5,
        margin: 30,
        loop: false
      },
    }
  }
  artistOptions: OwlOptions = {
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    loop: true,
    margin: 30,
    dots: true,
    dotsEach: true,
    nav: false,
    smartSpeed: 500,
    autoHeight: true,
    autoplay: true,
    autoplayTimeout: 5000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2,
        margin: 10
      },
      991: {
        items: 3,
        margin: 0
      },
      1024: {
        items: 1,
        loop: true,

      },
      1200: {
        items: 2,
        nav: false,
        dots: true
      }
    }
  }
  isLiked = false;
  availableDates: Date[] = [];
  availableTimes: string[] = [];
  selectedDate: Date = new Date();
  showDatePopup: boolean = false;
  selectedDateTime;
  availableTickets: Ticket[] = [];
  isOnwardsRequired: boolean = false;
  constructor(private platformLocation: PlatformLocation,private imagePreloadingService:ImagePreloadingService,private encryptionService: EncryptionService, private location: Location, private meta: Meta, private modalService: NgbModal, private renderer: Renderer2, private el: ElementRef, private datePipe: DatePipe, private dialog: MatDialog, private sanitizer: DomSanitizer, private eventService: EventService, private toasterService: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {


    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.checkViewportWidth();
    this.platformLocation.onPopState(() => {
      const dateModalRef = document.getElementById('mybookcal');
      var ticketModelRef = document.getElementsByTagName("ngb-modal-window");
      if (dateModalRef.classList.contains("show")) {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.platformLocation.forward();
      }
      if (ticketModelRef[0].classList.contains("show")) {
        this.modalService.dismissAll();
        this.platformLocation.forward();
      }
    });

    //checking click event listner
    document.addEventListener('click', (event) => this.handleClickOutside(event));
    this.activatedRoute.paramMap.subscribe(params => {
      this.intilizeEvent();
    });
    this.intilizeEvent();
  }

  intilizeEvent() {
    this.eventService.getEventByidForDetails(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((observer) => {
      if (observer.statusCode == 200) {

        this.event = observer.data;

        this.meta.addTag({ name: 'title', content: this.event.eventTitle });
        this.meta.addTag({ name: 'description', content: this.event.eventDescription });
        this.meta.addTag({ name: 'keywords', content: 'angular, dynamic, meta tags' });

        this.eventTicketPrice = observer.smallestTicketPrice;
        //for onwards after price
        this.isOnwardsRequired = observer.isOnwardsRequired;

        this.availableDates = this.event.eventDates.map(event => {
          const convertedDate = this.datePipe.transform(event.eventDate.split("T")[0], 'yyyy-MM-dd');
          return new Date(convertedDate);
        });
        this.eventStartTime = this.event.eventDates[0]?.eventStartTime;
        let eventEndTime = this.event.eventDates[0]?.eventEndTime;
        this.availableTimes = this.event.eventDates.map(date => date.eventStartTime);

        if (this.eventStartTime && eventEndTime) {
          this.eventDuration = this.calculateTimeDuration(this.eventStartTime, eventEndTime);
        }
        //this.event.eventDescription=this.convertLinksToClickable(this.event.eventDescription);
        //sanitizing url for embedded map
        if (this.event.eventLocation.hasOwnProperty('eventEmbeddedMapString') && (this.event.eventLocation?.eventEmbeddedMapString != '' || this.event.eventLocation?.eventEmbeddedMapString != '')) {
          this.event.eventLocation.eventEmbeddedMapString = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.eventLocation.eventEmbeddedMapString);
          this.hasMapString = true;
        }
        else this.hasMapString = false;

        //sanitizing url for YT link
        if (this.event.eventYtLink && this.event.eventYtLink != '') {
          this.event.eventYtLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.eventYtLink);
        }

        if (this.event.eventLikedBy.includes(localStorage.getItem("id"))) {
          this.isLiked = true;
        }

        if (this.imagePreloadingService.isEventDetailsPageBannerLoadedFirstTime) {
          setTimeout(() => {
            this.isBannerLoaded = true
          }, 500);
          this.imagePreloadingService.setNotFirstTimeLoadEventdetailsBanner();
        } else {
          this.isBannerLoaded = true
        }

        //this.safeUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.event.eventLocation.eventEmbeddedMapString);
        // this.setEventArtist();
        // this.setofflieSeller();
        this.eventService.getAllEventsByApprovalStatus('approved', 'live', 0).subscribe((observer) => {

          if (observer.statusCode == 200) {

            for (let i = 0; i < observer.data.length; i++) {
              if (observer.data[i]._id != this.event._id) {
                this.similarEvents.push(observer.data[i]);
                this.similarEventTicketPrice.push(observer.eventsWithSmallestTicketPrice[i]);
              }
            }

            // observer.data = observer.data.filter(event => event._id != this.event._id);
            // this.similarEvents = observer.data;

            // console.log(observer);

            // if (this.similarEvents?.length > 0) {
            //   this.similarEventTicketPrice = observer.eventsWithSmallestTicketPrice;



            //   this.similarEvents.push(observer.data[0]);
            //   this.similarEvents.push(observer.data[1]);
            //   this.similarEvents.push(observer.data[2]);
            //   this.similarEvents.push(observer.data[3]);

            //   this.similarEventTicketPrice.push(observer.eventsWithSmallestTicketPrice[0]);
            //   this.similarEventTicketPrice.push(observer.eventsWithSmallestTicketPrice[1]);
            //   this.similarEventTicketPrice.push(observer.eventsWithSmallestTicketPrice[2]);
            //   this.similarEventTicketPrice.push(observer.eventsWithSmallestTicketPrice[3]);
            // }

          } else {
            this.toasterService.error(observer.message, "", { timeOut: 3000 });
          }
        })
        //this.toasterService.success("event details fetched successfully!","",{timeOut:3000});
      } else {
        this.toasterService.error("something went wrong,please try again later", "", { timeOut: 3000 });
        this.router.navigate([""]);
      }
    })
  }
  truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }


  calculateTimeDuration(startTime: string, endTime: string): string {
    const format = 'h:mm A'; // Assuming your times are in 12-hour format

    // Parse start and end times
    const start = moment(startTime, format);
    const end = moment(endTime, format);

    // If end time is before start time, assume it's on the next day
    if (end.isBefore(start)) {
      end.add(1, 'day');

    }
    // Calculate duration
    const duration = moment.duration(end.diff(start));

    // Get hours and minutes
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${hours} hrs ${minutes} mins`;
  }

  formatDate(dateString: string): string {
    const date = moment(dateString).tz('Asia/Kolkata').toDate(); // Convert to IST

    return moment(date).format('ddd DD MMM YYYY');
  }
  isBeforeStartDate(startDate: string): boolean {
    return this.currentDate <= startDate.split('T')[0];
  }

  isAfterStartDate(event: any): boolean {
    this.currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

    for (let date of event.eventDates) {

      if (date.eventDate.split('T')[0] >= this.currentDate) {

        this.currentDate = date.eventDate;
        return true;
      }
    }
    return false;
  }

  getCurrentDateForDetails() {
    this.currentDateForDetails = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    
    for (let date of this.event.eventDates) {

      if (moment(date.eventDate.split('T')[0]).isAfter(moment(this.currentDateForDetails))) {

        this.currentDateForDetails = date.eventDate;
        return true;
      }
    }
    
    return false;
  }
  showDateSelectionPopup() {
    this.showDatePopup = true;
  }
  handleDateTimeConfirmation(dateTime: { date: Date; time: string }) {

    const modalElement = document.getElementById('mybookcal');
    if (modalElement) {
      modalElement.classList.remove('show'); // Remove the 'show' class to hide the modal
    }
    const { date, time } = dateTime;
    this.selectedDateTime = date;
    this.showDatePopup = false;
    this.selectedDate = date;

    const selectedDateEvent = this.event.eventDates.find(date => {
      const convertedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

      return date.eventDate.split("T")[0] === convertedDate;
    });


    if (selectedDateEvent) {
      const activeTickets = selectedDateEvent.eventTicketTypes.filter(ticket => ticket.ticketStatus === "active");



      const activeTicketsfor: Ticket[] = activeTickets.map(ticket => ({
        _id: ticket._id,
        ticketTitle: ticket.ticketTitle,
        ticketPrice: ticket.ticketPrice,
        totalAvailableTickets: ticket.totalAvailableTickets,
        quantity: 0,
        ticketCurrency: ticket.ticketCurrency,
        ticketDescription: ticket.ticketDescription,
        ticketPriorityNumber: ticket.ticketPriorityNumber,
        isSeasonPass: ticket.isSeasonPass,
        ticketsSold: ticket.ticketsSold,
        ticketStatus: ticket.ticketStatus,
        allowedPerson: ticket.allowedPerson,
        eventForTicket: ticket.eventForTicket,
        promoCodes: ticket.promoCodes
      }));
      this.availableTickets = activeTicketsfor;

      this.availableTickets.sort((a, b) => b?.ticketPriorityNumber - a?.ticketPriorityNumber);

      document.getElementById("ticketModal")?.click();
    } else {
      console.log("No event found for the selected date.");
    }
    // Handle the selected date and time (e.g., send it to the server for booking)
  }

  openDirectTicketModal() {
    this.selectedDateTime = this.availableDates[0];
    this.selectedDate = this.availableDates[0];

    const selectedDateEvent = this.event.eventDates.find(date => {
      const convertedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

      return date.eventDate.split("T")[0] === convertedDate;
    });

    if (selectedDateEvent) {

      const activeTickets = selectedDateEvent.eventTicketTypes.filter(ticket => ticket.ticketStatus === "active");

      const activeTicketsfor: Ticket[] = activeTickets.map(ticket => ({
        _id: ticket._id,
        ticketTitle: ticket.ticketTitle,
        ticketPrice: ticket.ticketPrice,
        totalAvailableTickets: ticket.totalAvailableTickets,
        quantity: 0,
        ticketCurrency: ticket.ticketCurrency,
        ticketDescription: ticket.ticketDescription,
        isSeasonPass: ticket.isSeasonPass,
        ticketsSold: ticket.ticketsSold,
        ticketStatus: ticket.ticketStatus,
        ticketPriorityNumber: ticket.ticketPriorityNumber,
        allowedPerson: ticket.allowedPerson,
        eventForTicket: ticket.eventForTicket,
        promoCodes: ticket.promoCodes
      }));
      this.availableTickets = activeTicketsfor;
      this.availableTickets.sort((a, b) => b?.ticketPriorityNumber - a?.ticketPriorityNumber);

  
      document.getElementById("ticketModal")?.click();
    }
  }
  parseInteger(number: string) {
    return parseInt(number);
  }
  toggleCollapase(from: string) {
    if (from == 'tac') {
      this.showTac = !this.showTac;
      this.oscollapse = false;
      this.vlcollapse = false;
      this.linkcollapse = false;
    }
    else if (from == 'os') {
      this.showTac = false;
      this.oscollapse = !this.oscollapse;
      this.vlcollapse = false;
      this.linkcollapse = false;
    }
    else if (from == 'link') {
      this.showTac = false;
      this.oscollapse = false;
      this.vlcollapse = false;
      this.linkcollapse = !this.linkcollapse;
    }
    else {
      this.linkcollapse = false;
      this.showTac = false;
      this.oscollapse = false;
      this.vlcollapse = !this.vlcollapse;
    }
  }
  ngAfterViewInit(): void {
    $('.event-slider-two').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      loop: true,
      nav: true,
      smartSpeed: 500,
      autoHeight: true,
      autoplay: true,
      autoplayTimeout: 5000,
      navText: ['', ''],
      responsive: {
        0: {
          items: 2,
          margin: 20,
          dots: true,
          // navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
        },
        600: {
          items: 2,
          margin: 20
        },
        1024: {
          items: 2,
          margin: 30,
        },
      }
    });
    $('.profile-slider').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      loop: true,
      margin: 30,
      dots: true,
      dotsEach: true,
      dotData: true,
      nav: false,
      smartSpeed: 500,
      autoHeight: true,
      autoplay: true,
      autoplayTimeout: 1000,
      navText: ['', ''],
      onInitialized: this.adjustSlideDimensions,
      onResized: this.adjustSlideDimensions,
      responsive: {
        0: {
          items: 2,
          margin: 10
        },
        991: {
          items: 3,
          margin: 0
        },
        1024: {
          items: 1,
          loop: true,

        },
        1200: {
          items: 2,
          nav: false,
          dots: true
        }
      }
    });
    const elements: NodeListOf<Element> = document.querySelectorAll('.owl-dot');
    elements.forEach((element: Element) => {
      // Access and manipulate each element as needed
      const divElement = document.createElement('div');
      divElement.innerHTML = element.innerHTML;
      divElement.classList.add('owl-dot');
      element.parentNode.replaceChild(divElement, element);
    });
  }
  adjustSlideDimensions(event: any) {
    setTimeout(() => {
      const imageContainers = document.querySelectorAll('.image-container');
      let maxHeight = 0;

      imageContainers.forEach((container: any) => {
        const height = container.clientHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      imageContainers.forEach((container: any) => {
        container.style.height = 150 + 'px';
        container.style.width = 'auto';
      });
    });
  }
  readMore() {
    if (this.displayText === 'none') {
      this.displayText = 'block';
      const element: Element = document.querySelector('#myBtn');
      element.innerHTML = 'Read Less';
    }
    else {
      this.displayText = 'none';
      const element: Element = document.querySelector('#myBtn');
      element.innerHTML = 'Read More';
    }
  }
  bookEvent(): void {

    this.showDatePopup = true;
    document.getElementById("mybookcal")?.click();

  }
  toggleLike(): void {
    this.updateLikeCount();
  }
  async updateLikeCount() {

    const userId = localStorage.getItem("id");

    if (userId == null) {
      document.getElementById("openLogin")?.click();
    } else {
      this.likedEvent(userId);
    }
  }
  openGoogleMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  }
  checkViewportWidth() {
    if (window.innerWidth <= 768) {
      this.mobileView = true;
      return true;
    } else {
      this.mobileView = false;
      return false;
    }
  }
  async likedEvent(userId: any) {
    this.isLiked = !this.isLiked;

    if (!this.event.eventLikedBy.includes(localStorage.getItem("id"))) {
      this.event.eventLikedBy.push(userId);
      if (!this.event.eventLikeCount) {
        this.event.eventLikeCount = 0;
      }
      this.event.eventLikeCount = this.event.eventLikedBy.length;
      await this.eventService.updateEventLikedByAndEventLikeCount(this.event.eventLikedBy, this.event.eventLikeCount, this.activatedRoute.snapshot.paramMap.get('id'), true).subscribe(async (result) => {
        if (result.statusCode == 200) {
        } else {
          this.toasterService.error("something wen wrong,please try again after sometime", "", { timeOut: 3000 });
        }
      })
    }
    else {
      this.event.eventLikeCount = this.event.eventLikedBy.length - 1;

      const index = this.event.eventLikedBy.indexOf(localStorage.getItem("id"));
      this.event.eventLikedBy.splice(index, 1);
      await this.eventService.updateEventLikedByAndEventLikeCount([localStorage.getItem("id")], this.event.eventLikeCount, this.activatedRoute.snapshot.paramMap.get('id'), false).subscribe(async (result) => {
        if (result.statusCode == 200) {
        } else {
          this.toasterService.error("something wen wrong,please try again after sometime", "", { timeOut: 3000 });
        }
      })
    }
  }
  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
    this.similarEvents.pop(); this.similarEvents.pop(); this.similarEvents.pop();
  }
  capitalizeFirstChar(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  getCurrentUrl() {
    return window.location.href;
  }
  navigateToEventListForSimilar() {
    this.router.navigate(['/event-list']);
  }
  navigateToEventDetails(id: string) {
    this.router.navigate(['/event-details/' + id]);
  }
  handleClickOutside(event) {
    const shareModalData = document.getElementById('modalpop');
    if (event.target === shareModalData) {
      // Click occurred outside the modal, close it
      this.closeShareModal();
    }
  }
  closeShareModal() {

    this.shareModal = !this.shareModal;
  }
  // TypeScript (Angular) or JavaScript

  shareToPlatform(platform: string) {
    const text = 'Hey, take a look at this event!\n\n*' + this.event.eventTitle + '* :- ' + window.location.href + '\n\nFor other events :- https://showmates.in/';
    //    const url = 'https://showmates.in/event-details/64a3e75779a37838f11c0f7f';  // Get the current page URL

    switch (platform) {
      case 'whatsapp':


        const whatsappText = `${text}`;
        const imageToShare = "https://showmates.in:3000/" + this.event.eventImages.eventBannerImage;

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}&image=${encodeURIComponent(imageToShare)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'twitter':
        const twitterText = `${text}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;
        window.open(twitterUrl, '_blank');
        break;
      case 'facebook':
        const ogUrl = document.querySelector('meta[property="og:url"]').getAttribute('content');
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${ogUrl}`;
        window.open(facebookUrl, '_blank');
        break;
      case 'copylink':
        // Get the current page URL
        const data = text;
        navigator.clipboard.writeText(data)
          .then(() => {

            this.closeShareModal();
            // You can show a success message to the user or perform any other desired action
          })
          .catch((error) => {
            // Handle the error, such as showing an error message to the user
          });
        break;
      case 'instagram':
        const instagramText = `${text}`;
        const instagramUrl = `https://www.instagram.com/?caption=${instagramText}`;

        window.open(instagramUrl, '_blank');
        break;


      // case 'linkedin':
      //   const linkedinText = `${text} ${url}`;
      //   const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&title=&url=${url}&summary=${linkedinText}`;
      //   window.open(linkedinUrl, '_blank');
      //   break;
      // case 'snapchat':
      //   const snapchatText = `${text} ${url}`;
      //   const snapchatUrl = `https://www.snapchat.com/share?url=${url}&caption=${snapchatText}`;
      //   window.open(snapchatUrl, '_blank');
      //   break;
      default:
        break;
    }
  }
  // convertLinksToClickable(text: string): string {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.replace(urlRegex, '<a href="$1" target="_blank"></a>');
  // }

  share() {
    const shareData = {
      title: document.title,
      text: 'Hey, take a look at this event!\n\n*' + this.event.eventTitle + '* :- ' + window.location.href + '\n\nFor other events :- https://showmates.in/'
    };

    if (this.checkViewportWidth()) {
      //Use Web Share API for mobile devices
      navigator.share(shareData)
        .then(() => {
        })
        .catch((error) => {
        });
    } else {
      //using custom modal for desktop view
      this.shareModal = !this.shareModal;

    }
  }

}
