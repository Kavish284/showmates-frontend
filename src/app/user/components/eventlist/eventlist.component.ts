import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Event } from '../../models/event';
import { CategoryService } from '../../../shared/services/category.service';
import { EventService } from '../../../shared/services/event.service';
import { ParentComponentService } from '../../../shared/services/parent.service';
import { ipPath } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.css']
})
export class EventlistComponent implements OnInit {
  ipPath = ipPath;
  minDate;
  currentDate: any = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
  loadedEvents: Array<any> = [];
  isBlocked: boolean = false;
  totalEventsLength: number;
  searchTextFlag = false;
  eventTicketPrice = [];
  filterText: string = '';
  sortBy: string = '';
  dateSelected: string = '';
  selectedCategory: Array<string> = [];
  selectedLanguage: string = '';
  allList: Array<any> = [];
  commonValues: Array<any> = this.loadedEvents;
  categoryList: Array<any> = this.loadedEvents;
  languageList: Array<any> = [];
  filterOpen: boolean = false;
  isMobile: boolean = false;
  priceRange = [0, 10000];
  minPrice = 0;
  maxPrice = 10000;
  leftval = 0;
  left: string = this.leftval + '%';
  rightval = 0;
  right: string = this.rightval + '%';
  isArea: boolean = false;
  isOnDirectListPage: boolean = true;
  area: string = '';
  isActive: boolean = false;
  filteredEventTicketPrice = [];
  months: string[] = [
    'JAN', "FEB", 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];
  catagories: Array<any>;
  categoryItems: any[] = [
    { name: 'Concert', isActive: false },
    { name: 'Stand-up', isActive: false },
    { name: 'Festival', isActive: false },
    { name: 'Education', isActive: false },
    { name: 'Fitness', isActive: false },
    { name: 'Food and drinks', isActive: false },
    { name: 'Business', isActive: false },
    { name: 'Workshop', isActive: false }
  ];

  isSearchTextFromOtherPages: boolean;
  isSearchTextFromEventListPage: boolean;
  constructor(private route: ActivatedRoute, private parentComponentService: ParentComponentService, private eventService: EventService, private toasterService: ToastrService, private router: Router, private categoryService: CategoryService) {
    this.parentComponentService.setParentComponentName('eventlist');
    this.categoryService.getAllCatagories().subscribe((observer) => {
      if (observer.statusCode == 200) {
        this.catagories = observer.data;
      }
    })
    if (this.router.getCurrentNavigation().extras.state) {
      /* this.route.queryParams.subscribe(params => {
        const data = params;
        this.filterText = data['searchText'];
      }); */

      if (this.router.getCurrentNavigation().extras.state['data'].from === 'homeCategory') {
        this.selectedCategory.push(this.router.getCurrentNavigation().extras.state['data'].category);
        this.selectValue(this.selectedCategory[0]);
        this.isOnDirectListPage = false;
      } else if (this.router.getCurrentNavigation().extras.state['data'].from === 'seeAllSimilar') {
        this.selectedCategory.push(this.router.getCurrentNavigation().extras.state['data'].category);
        this.selectValue(this.selectedCategory[0]);
      } else if (this.router.getCurrentNavigation().extras.state['data'].from === 'homeArea') {
        this.isArea = true;
        this.isOnDirectListPage = false;
        this.area = this.router.getCurrentNavigation().extras.state['data'].area;
      }
      else {
        this.isOnDirectListPage = false;
        this.filterText = this.router.getCurrentNavigation().extras.state['data']?.searchText;
        this.isSearchTextFromOtherPages = true;

      }


    }
  }

  truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }

  async listenSearchParameters() {

    this.route.queryParams.subscribe(params => {
      // Access the query parameters
      const data = params['searchText']; // Assuming 'data' is the query parameter you want to retrieve
      this.eventService.getEventByGlobalSearch(data).subscribe((observer) => {
        this.loadedEvents = observer.data;

      })


    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {


    const scrollTop = document.body.scrollTop;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.body.clientHeight;

    if (!this.searchTextFlag) {
      if (scrollTop + clientHeight >= scrollHeight && this.loadedEvents.length < this.totalEventsLength) {

        this.fetchNextData();
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewportWidth();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const data = queryParams['from']; // Access 'from' query parameter
      const category = queryParams['category'];
      if (data) {
        this.clearFilter();
        this.selectedCategory.push(category);
        this.selectValue(this.selectedCategory[0]);
      }
    });
    //if user search from event list page
    this.route.queryParams.subscribe(params => {
      const searchText = params['searchText'];

      if (searchText) {
        this.searchTextFlag = true;

        this.eventService.getEventByGlobalSearch(searchText).subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.loadedEvents = response.data;
              this.eventTicketPrice = response.eventsWithSmallestTicketPrice;
              this.filteredEventTicketPrice = this.eventTicketPrice;
            } else {
              //this.toastrService.error(response.message, '', { timeOut: 3000 });
            }
          },
          (error) => {
            //this.toastrService.error('An error occurred. Please try again.', '', { timeOut: 3000 });
          }
        );
      } else {
        // Handle the case when no search text is present
      }
    });

    if (this.isSearchTextFromOtherPages) {
      this.fetchSearchTextData();
    }
    else if (!this.isArea) {
      this.fetchInitialData();
    }
    else {
      this.fetchDataByArea();
    }


    if (window.innerWidth <= 768) {
      this.filterOpen = false;
      this.isMobile = true;
    }
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
  }
  validateMinPrice() {
    if (this.minPrice < 0) {
      this.minPrice = 0;
    } else if (this.minPrice >= 9000) {
      this.minPrice = 9000;
    }
    else if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice - 500;
    }
    this.handleSliderDragInput();
  }
  parseInteger(number: string) {
    return parseInt(number);
  }
  validateMaxPrice() {
    if (this.maxPrice < 500) {
      this.maxPrice = 500;
    } else if (this.maxPrice > 10000) {
      this.maxPrice = 10000;
    }
    else if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice + 500;
    }
    this.handleSliderDragInput();
  }
  async fetchSearchTextData() {
    await this.eventService.getEventByGlobalSearch(this.filterText).subscribe((observer) => {

      this.loadedEvents = observer.data;
      this.eventTicketPrice = observer.eventsWithSmallestTicketPrice;
      this.filteredEventTicketPrice = this.eventTicketPrice;
    })
  }

  async fetchInitialData() {

    await this.eventService.getAllEventsByApprovalStatusWithOffset('approved', 'live', 0).then((observer) => {

      if (observer.statusCode == 200) {
        this.loadedEvents = observer.data;
        this.totalEventsLength = observer.totalEventsLength;
        this.eventTicketPrice = observer.eventsWithSmallestTicketPrice;
        this.filteredEventTicketPrice = this.eventTicketPrice;
      } else {
        //this.toasterService.error(observer.message, "", { timeOut: 3000 });
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  async fetchNextData() {
    if (this.isOnDirectListPage == false) {
      return;
    }
    if (this.isBlocked) {
      return;
    }
    this.isBlocked = true;
    await this.eventService.getAllEventsByApprovalStatusWithOffset('approved', 'live', this.loadedEvents.length).then((observer) => {
      if (observer.statusCode == 200) {


        if (observer.data.length != 0) {

          this.loadedEvents = [...this.loadedEvents, ...observer.data];

        }
      } else {
        //handle error here
      }
    }).catch((error) => {
      console.log(error);

    })
    this.isBlocked = false;
  }
  async fetchDataByArea() {
    await this.eventService.getAllEventsByArea(this.area).subscribe((observer) => {
      if (observer.statusCode == 200) {
        this.loadedEvents = observer.data;
        this.eventTicketPrice = observer.eventsWithSmallestTicketPrice;
        this.filteredEventTicketPrice = this.eventTicketPrice;
      } else {
        //this.toasterService.error(observer.message, "", { timeOut: 3000 });
      }
    })
  }
  checkViewportWidth() {
    if (window.innerWidth <= 768) {
      this.filterOpen = false;
      this.isMobile = true;
    }
  }
  openFilter() {
    this.filterOpen = !this.filterOpen;
  }
  capitalizeFirstChar(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  selectValue(str1: string): void {
    this.categoryItems.map((item) => {

      if (item.name === str1) {

        item.isActive = !item.isActive;
        if (item.isActive) {

          if (this.selectedCategory.find(category => category == str1)) { }
          else { this.selectedCategory.push(str1); }
        }
        else {
          const index = this.selectedCategory.indexOf(str1);
          this.selectedCategory.splice(index, 1);
        }
      }
    })
  }
  handleSliderDrag(event: MouseEvent) {
    if (this.minPrice >= this.maxPrice) {
      if (this.maxPrice < 500) {
        this.maxPrice = 500;
      } else {
        this.minPrice = this.maxPrice - 500;
      }
      //if(this.minPrice<0)this.minPrice=0;
      this.leftval = (this.minPrice - this.priceRange[0]) / 100;
      this.left = this.leftval + '%';
      this.rightval = (this.priceRange[1] - this.maxPrice) / 100;
      this.right = this.rightval + '%';
    }
    else if (this.maxPrice - this.minPrice >= 500) {
      this.leftval = (this.minPrice - this.priceRange[0]) / 100;
      this.left = this.leftval + '%';
      this.rightval = (this.priceRange[1] - this.maxPrice) / 100;
      this.right = this.rightval + '%';
    } else if (this.maxPrice + 100 > this.priceRange[1]) {
      this.maxPrice = this.priceRange[1];
    } else {
      this.maxPrice = this.maxPrice + 500;
    }
    this.filterData();
  }
  handleSliderDragInput() {
    if (this.minPrice >= this.maxPrice) {
      if (this.maxPrice < 500) {
        this.maxPrice = 500;
      } else {
        this.minPrice = this.maxPrice - 500;
      }
      //if(this.minPrice<0)this.minPrice=0;
      this.leftval = (this.minPrice - this.priceRange[0]) / 100;
      this.left = this.leftval + '%';
      this.rightval = (this.priceRange[1] - this.maxPrice) / 100;
      this.right = this.rightval + '%';
    }
    else if (this.maxPrice - this.minPrice >= 500) {
      this.leftval = (this.minPrice - this.priceRange[0]) / 100;
      this.left = this.leftval + '%';
      this.rightval = (this.priceRange[1] - this.maxPrice) / 100;
      this.right = this.rightval + '%';
    } else if (this.maxPrice + 100 > this.priceRange[1]) {
      this.maxPrice = this.priceRange[1];
    } else {
      this.maxPrice = this.maxPrice + 500;
    }
    this.filterData();
  }
  get filteredData(): any[] {
    if (this.selectedCategory.length === 0 &&
      this.selectedLanguage.length === 0 &&
      this.minPrice === 0 &&
      this.maxPrice === 10000 &&
      this.dateSelected.length === 0) {

      this.filteredEventTicketPrice = this.eventTicketPrice;
      return this.loadedEvents;
    }
    else {
      return this.filterData();
    }

  }
  filterData(): Event[] {

    this.allList = [];
    this.commonValues = [];
    if (this.selectedCategory.length === 0) {
      this.categoryList = this.loadedEvents;
    } else {

      this.categoryList = [];

      this.selectedCategory.forEach(category => {
        for (let i = 0; i < this.loadedEvents.length; i++) {

          if (this.loadedEvents[i].eventCatagory === category) {
            this.categoryList.push(this.loadedEvents[i]);
          }
        }
      });
    }

    if (this.selectedLanguage.length === 0) {
      this.languageList = this.loadedEvents;
    } else {
      this.languageList = [];
      for (const event of this.loadedEvents) {
        for (const language of event.eventLanguages) {
          if (language.toLowerCase() === this.selectedLanguage.toLowerCase()) {

            this.languageList.push(event);
          }
        }
      }
    }
    for (const event of this.categoryList) {
      for (const item of this.languageList) {
        if (event._id === item._id) {
          this.commonValues.push(event);
        }
      }
    }

    this.filteredEventTicketPrice = [];

    for (const event of this.commonValues) {

      let smallestTicketPrice = Infinity;

      event.eventDates.forEach(date => {
        date.eventTicketTypes.forEach(ticketType => {
          if (ticketType.ticketPrice < smallestTicketPrice) {
            smallestTicketPrice = ticketType.ticketPrice;
          }
        });
      });
      const smallestPrice = smallestTicketPrice === Infinity ? 0 : smallestTicketPrice;

      if (smallestPrice >= this.minPrice && smallestPrice <= this.maxPrice) {
        this.allList.push(event);
        this.filteredEventTicketPrice.push(smallestPrice);
      }
    }
    if (this.dateSelected.length > 0) {

      this.allList = this.filterDataByDate(this.allList, this.dateSelected)
    }
    return this.allList;

  }
  formatDate(dateString: string): string {
    const date = moment(dateString).tz('Asia/Kolkata').toDate(); // Convert to IST

    return moment(date).format('ddd DD MMM YYYY');
  }
  isBeforeStartDate(startDate: string): boolean {
    return this.currentDate <= startDate.split('T')[0];
  }

  isAfterStartDate(event:any): boolean {
    this.currentDate=moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    
    for(let date of event.eventDates){
      
      if(date.eventDate.split('T')[0]>=this.currentDate){
      
        this.currentDate=date.eventDate;
        return true;
      }  
   }
    return false;
  }

  filterDataByDate(data: any[], targetDate: string): any[] {

    const tempPrices=this.filteredEventTicketPrice;
    this.filteredEventTicketPrice=[];
  
    // Filter events based on the target date
    return data.filter((event,index) => {
     
      return event.eventDates.some((eventDate) => {

        // Compare eventDate with targetDate
        const eventDateValue = moment(eventDate.eventDate).format("YYYY-MM-DD"); // Convert eventDate to required format
      
        if(eventDateValue==targetDate){
        
          this.filteredEventTicketPrice.push(tempPrices[index]);
        }
        return eventDateValue == targetDate;
      });
    });

  }
  clearFilter() {
    this.selectedCategory = [];
    this.categoryItems.map((item) => {
      item.isActive = false;
    })
    this.selectedLanguage = '';
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.dateSelected = '';
  }
  onSortByChange() {

    if (this.sortBy == "") {
      this.fetchInitialData();
    } else {
      this.sortData();
    }
  }
  navigateToEventDetails(id: String) {
    this.router.navigate(['/event-details/' + id]);
  }
  // Function to sort the data based on the selected option
  sortData() {
    this.eventService.getSortedEvent(this.sortBy).subscribe((observer) => {
      if (observer.statusCode == 200) {
        this.loadedEvents = observer.data;

        this.eventTicketPrice = observer.eventsWithSortedTicketPrice;
        this.filteredEventTicketPrice = this.eventTicketPrice;
      } else {
        //this.toasterService.error(observer.message, "", { timeOut: 3000 });
      }
    })

  }
}
