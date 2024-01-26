import { AfterViewInit, Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { User } from 'firebase/auth';
import { EventService } from '../../services/event.service';
import 'jquery';
import 'owl.carousel';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from '../../services/banner.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ipPath } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import * as moment from 'moment';
import 'moment-timezone';
import { ImagePreloadingService } from '../../services/image-preloading.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  ipPath = ipPath;
  category;
  isLoading: boolean = true;
  day;
  currentDate: any = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
  isCarouselDisabled = true;
  isCategoryDisabled = true;
  disabled = false;
  events: Array<any> = [];
  user: Observable<User>;
  bannerData: Array<any> = [];
  slider1 = 'slider1';
  slider2 = 'slider2';
  catagories: Array<any>;
  eventTicketPrice = [];
  bannerImagesToPreloadForWebsite: string[] = [];
  bannerImagesToPreloadForMobile: string[] = [];
  upcomingEventsImagesToPreload: string[] = [];
  preloadedUpcomingEventsImages: any = [];
  preloadedBannerImagesForWebsite: any[] = [];
  preloadedBannerImagesForMobile: any[] = [];
  bannerLoaded: boolean = false;
  mobileBannerLoaded:boolean=false;
  eventDataLoaded=false;
  firstTimeMobileBannerLoaded:boolean=false;

  upcomingEventImagesLoaded:boolean = false;

  months: string[] = [
    'JAN', "FEB", 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];


  bannerOptions: OwlOptions = {
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    loop: true,
    margin: 10,
    dots: false,
    center: true,
    smartSpeed: 500,
    autoHeight: true,
    autoplay: true,
    autoplayTimeout: 5000,
    items: 1,
    stagePadding: 10,
    nav: false,
    responsive: {
      0: {
        items: 1.2,
      },
      700: {
        items: 1.2,
      },
    }
  }
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 700,
    margin: 10,
    autoplay: false,
    autoplayTimeout: 5000,
    responsive: {
      0: {
        items: 1
      },
      50: {
        items: 2
      }
    },
    nav: false,
    navText: ['<i class="flaticon-left-arrow left"></i>', '<i class="flaticon-right-arrow right">'],
    dots: false,

  }
  categoryOption: OwlOptions = {
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    loop: false,
    margin: 20,
    nav: false,
    dots: false,
    smartSpeed: 500,
    autoHeight: true,
    autoplay: true,
    autoplayTimeout: 5000,
    navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
    items: 2
  }

  constructor(public loaderService: LoaderService, private imagePreloadingService: ImagePreloadingService, private categoryService: CategoryService, private toastrService: ToastrService, private bannerService: BannerService, private eventService: EventService, private router: Router) {

    this.day = 'all';
    this.category = 'any-category';
    this.categoryService.getAllCatagories().subscribe((observer) => {
      if (observer.statusCode == 200) {
        this.catagories = observer.data;
      }
    })
    if (window.innerWidth <= 768) {
      this.isCarouselDisabled = false;
      this.isCategoryDisabled = false;
    }
   
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewportWidth();
  }
  isMobileDevice() {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
  }
  checkViewportWidth() {
    if (window.innerWidth <= 768) { // Adjust the breakpoint as needed
      this.isCarouselDisabled = false;
      this.isCategoryDisabled = false;
      $('#eventcat').owlCarousel({
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        navSpeed: 700,
        margin: 10,
        padding: 10,
        autoplay: false,
        autoplayTimeout: 5000,
        nav: false,
        responsive: {
          0: {
            items: 1
          },
          50: {
            items: 2
          },
        },
        navText: ['<i class="flaticon-left-arrow left"></i>', '<i class="flaticon-right-arrow right">'],
        dots: false,

      });

    } else {
      this.isCarouselDisabled = true;
      this.isCategoryDisabled = true;
      $('#eventcat').owlCarousel('destroy');
    }
  }

  getUpcomingEvents(flag: any) {

    //creating this data to send for upcoming events
    const data = {
      category: this.category,
      day: this.day
    }

    this.eventService.getUpcomingEvents(data, flag).subscribe((observer) => {

      if (observer.statusCode == 200) {
        this.events = observer.data;

        for (let i = 0; i < this.events?.length; i++) {

          this.preloadedUpcomingEventsImages[i].src = ipPath + this.events[i].eventImages.eventCardImage;
        }
        //setting smallest price 
        this.eventTicketPrice = observer.eventsWithSmallestTicketPrice;
      } else {
        this.toastrService.error(observer.message, "", { timeOut: 3000 });
      }
    })
    // this.bannerService.getAllActiveBannerImages().subscribe((observer) => {
    //   if (observer.statusCode == 200) {
    //     this.bannerData = observer.data

    //   }
    // })
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

  isAfterEndDate(endDate: string): boolean {
    return this.currentDate > endDate.split('T')[0];
  }
  parseInteger(number: string) {
    return parseInt(number);
  }
  truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }
  ngOnInit(): void {

    this.getActiveBannerImages();
this.getUpcomingEventsWithoutFilter();
  }

  async getUpcomingEventsWithoutFilter() {

    //creating this data to send for upcoming events
    const data = {
      category: this.category,
      day: this.day
    }
    this.disabled = true;
    await this.eventService.getUpcomingEvents(data, "withoutfilter").subscribe(async (observer) => {
      if (observer.statusCode == 200) {
        this.events = observer.data;
        this.isLoading = false;
        this.eventDataLoaded=true;
        
        //collecting all images for preloading
        for (let event of this.events) {
          this.upcomingEventsImagesToPreload.push(ipPath + event.eventImages.eventCardImage);
        }
        //preloading images
        await this.imagePreloadingService.preloadImages(this.upcomingEventsImagesToPreload).then((loadedImages) => {
          this.preloadedUpcomingEventsImages = loadedImages; // Store preloaded images in the component property

        });

        this.upcomingEventImagesLoaded=true;
        //setting smallest price 
        this.eventTicketPrice = observer.eventsWithSmallestTicketPrice;
      } else {
        this.toastrService.error(observer.message, "", { timeOut: 3000 });
      }
    })
  }
 async getActiveBannerImages() {

    await  this.bannerService.getAllActiveBannerImages().subscribe(async (observer) => {
      if (observer.statusCode == 200) {
        this.bannerData = observer.data
        //colecting all images for preloading it
        for (let image of this.bannerData) {
          this.bannerImagesToPreloadForWebsite.push(ipPath + image.webBannerImagePath);
          this.bannerImagesToPreloadForMobile.push(ipPath + image.mobileBannerImagePath);
        }

        
        //preloading images
        await this.imagePreloadingService.preloadImages(this.bannerImagesToPreloadForWebsite).then((loadedImages) => {

          this.preloadedBannerImagesForWebsite = loadedImages; // Store preloaded images in the component property
          
        });
        await this.imagePreloadingService.preloadImages(this.bannerImagesToPreloadForMobile).then((loadedImages) => {

          this.preloadedBannerImagesForMobile = loadedImages; // Store preloaded images in the component property
        });

       
        this.bannerLoaded=true;
        
        if(this.imagePreloadingService.isFirstLoad){
          setTimeout(() => {
            this.mobileBannerLoaded=true;
          }, 200);
          this.imagePreloadingService.setNotFirstTimeLoad();
        }else{
          this.mobileBannerLoaded=true;
        }
        
      }
    })
  }

  //  getActiveBannerImages() {

  //     this.bannerService.getAllActiveBannerImages().subscribe( (observer) => {
  //     if (observer.statusCode == 200) {
  //       this.bannerData = observer.data
  //       //colecting all images for preloading it
  //       for (let image of this.bannerData) {
  //         this.bannerImagesToPreloadForWebsite.push(ipPath + image.webBannerImagePath);
  //         this.bannerImagesToPreloadForMobile.push(ipPath + image.mobileBannerImagePath);
  //       }



  //       //preloading images
  //        this.imagePreloadingService.preloadImages(this.bannerImagesToPreloadForWebsite).then((loadedImages) => {

  //         this.preloadedBannerImagesForWebsite = loadedImages; // Store preloaded images in the component property
          
  //       });
  //        this.imagePreloadingService.preloadImages(this.bannerImagesToPreloadForMobile).then((loadedImages) => {

  //         this.preloadedBannerImagesForMobile = loadedImages; // Store preloaded images in the component property
         
  //       });

       
  //       this.bannerLoaded=true;
        
  //     }
  //   })
  // }

  ngAfterViewInit(): void {
    this.initOwlSliders();
 
    setTimeout(() => {
      if (this.isLoading) {
        this.loaderService.setLoaderDisplayedFlag();
      }
      this.isLoading = false;
     
    }, 2500);

   
  }
  navigateToListWithArea(area: string) {
    const data = {
      from: 'homeArea',
      area: area,
    }
    this.router.navigate(['/event-list'], { state: { data: data } });
  }
  navigateToEventList() {
    this.router.navigate(['/event-list']);
  }
  navigateToEventDetails(id: String) {
    this.router.navigate(['/event-details/' + id]);
  }
  navigateToList(category: String) {
    const data = {
      from: 'homeCategory',
      category: category,
    }
    this.router.navigate(['/event-list'], { state: { data: data } });
  }
  capitalizeFirstChar(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  bannerOption: OwlOptions = {
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    loop: true,
    margin: 10,
    dots: false,
    center: true,
    smartSpeed: 500,
    autoHeight: true,
    autoplay: true,
    autoplayTimeout: 5000,
    nav: true,
    navText: ['<span style="display:none;" class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
    responsive: {
      0: {
        items: 1.2,
        autoWidth: false,
        nav: true,
        margin: 5
      },
      600: {
        items: 1.2,
        autoWidth: false,
        nav: true,
        margin: 5
      },
      1024: {
        items: 1.2,
        autoWidth: false,
        nav: true,
        margin: 5,
        loop: true
        // nav: true
      },
      1190: {
        items: 1,
        autoWidth: false,
          //nav: true
          /*},
          1450: {
              items: 3,
              autoWidth: true,
              nav: true
          }  */}
    }

  }
  initOwlSliders() {
    if ($('.cat-slider').length) {
      $('.cat-slider').owlCarousel({
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        loop: false,
        nav: true,
        dots: false,
        smartSpeed: 500,
        autoHeight: true,
        autoplay: true,
        autoplayTimeout: 5000,
        navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
        responsive: {
          0: {
            items: 2,
            margin: 20,
          },
          600: {
            items: 3,
            margin: 20
          },
          1024: {
            items: 5,
            margin: 30
          },
        }
      });
      // Code to change the button to a div element
      /*  const buttonElement: HTMLButtonElement = this.elementRef.nativeElement.querySelector('');
        const divElement = document.createElement('div');
        divElement.innerHTML = buttonElement.innerHTML;
        buttonElement.parentNode.replaceChild(divElement, buttonElement);
      */
    }
    $(function () {
      var owl = $('.category-slider'),
        owlOptions = {
          animateOut: 'fadeOut',
          animateIn: 'fadeIn',
          loop: false,
          margin: 20,
          nav: true,
          dots: false,
          smartSpeed: 500,
          autoHeight: true,
          autoplay: true,
          autoplayTimeout: 5000,
          navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
          items: 2
        };

      if ($(window).width() <= 767) {
        var owlActive = owl.owlCarousel(owlOptions);
      } else {
        owl.addClass('off');
      }

      $(window).resize(function () {
        if ($(window).width() <= 767) {
          if ($('.category-slider').hasClass('off')) {
            var owlActive = owl.owlCarousel(owlOptions);
            owl.removeClass('off');
          }
        } else {
          if (!$('.category-slider').hasClass('off')) {
            owl.addClass('off').trigger('destroy.owl.carousel');
            owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
          }
        }
      });
    });
  }
}
