import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../shared/services/category.service';
import { ParentComponentService } from '../../../shared/services/parent.service';
import { ipPath } from 'src/environments/environment';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { EventService } from 'src/app/shared/services/event.service';
import { Event } from '../../models/event';
@Component({
  selector: 'app-liked-eventlist',
  templateUrl: './liked-eventlist.component.html',
  styleUrls: ['./liked-eventlist.component.css']
})
export class LikedEventlistComponent implements OnInit{
  ipPath=ipPath;
  minDate;
  events:Array<Event>=[];
  filterText: string = '';
  sortBy: string = '';
  dateSelected:string='';
  selectedCategory:Array<string>=[];
  selectedLanguage:string = '';
  allList:Array<Event>=[];
  commonValues:Array<Event>=this.events;
  categoryList:Array<Event>=this.events;
  languageList:Array<Event>=[];
  filterOpen:string='block';
  priceRange=[0,10000];
  minPrice = 0; 
  maxPrice = 10000;
  leftval = 0;
  left:string=this.leftval+'%';
  rightval = 0;
  right:string=this.rightval+'%';

  isActive:boolean=false;
  catagories:Array<any>;
  categoryItems: any[] = [
    { name: 'dj-parties', isActive: false },
    { name: 'stand-up', isActive: false },
    { name: 'sports', isActive: false },
    { name: 'education', isActive: false },
    { name: 'dance', isActive: false },
    { name: 'music', isActive: false },
    { name: 'yoga', isActive: false },
    { name: 'art', isActive: false },
    { name: 'food and drinks', isActive: false },
    { name: 'kids', isActive: false },
    { name: 'business', isActive: false },
    { name: 'student', isActive: false }
  ];
  months:string[]=[
   'JAN',"FEB",'MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'
  ];
  constructor(private route: ActivatedRoute,private encryptionService:EncryptionService,private parentComponentService: ParentComponentService,private eventService:EventService,private toasterService:ToastrService,private router:Router,private categoryService:CategoryService){
    this.parentComponentService.setParentComponentName('userlikeeventlist');
    this.categoryService.getAllCatagories().subscribe((observer)=>{
      if(observer.statusCode==200){
        this.catagories=observer.data;
      }
    })
    if(this.router.getCurrentNavigation().extras.state){
      this.route.queryParams.subscribe(params => {
        const data = params;
        this.filterText = data['searchText'];
      });
      if(this.router.getCurrentNavigation().extras.state['data'].from === 'homeCategory'){
        this.selectedCategory.push(this.router.getCurrentNavigation().extras.state['data'].category);
        this.selectValue(this.selectedCategory[0]);
      }else{
        this.filterText=this.router.getCurrentNavigation().extras.state['data'].searchText;
      }
  }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewportWidth();
  }
  ngOnInit(): void {
    document.getElementById("closeAddEvent")?.click();
    this.fetchData();
    if (window.innerWidth <= 768){
      this.filterOpen='none';
    }
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0]; 
  }
  fetchData(){
    const userid =localStorage.getItem("id")
   
    this.eventService.getEventLikedByUser(userid).subscribe((observer)=>{
 
      if(observer.statusCode==200){
        this.events=observer.data;
      }else{
        this.toasterService.error(observer.message,"",{timeOut:3000});
      }
    })
  }
  checkViewportWidth(){
    if (window.innerWidth <= 768){
      this.filterOpen='none';
    }
  }
  openFilter(){
    if(this.filterOpen === 'none')
      this.filterOpen='block';
    else
      this.filterOpen='none';
  }
  capitalizeFirstChar(str: string): string {
     return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  selectValue(str1:string):void{
    this.categoryItems.map((item)=>{
      if(item.name===str1){
        item.isActive=!item.isActive;
        if(item.isActive){ 
          if(this.selectedCategory.find(category => category === str1)){}
          else {this.selectedCategory.push(str1);}
        }
        else{
          const index = this.selectedCategory.indexOf(str1);
          this.selectedCategory.splice(index,1);
        }
      }
    })
  }
  handleSliderDrag(event:MouseEvent) {
    if(this.maxPrice-this.minPrice > 1000){
    this.leftval = (this.minPrice - this.priceRange[0])/100;
    this.left=this.leftval+'%';
    this.rightval = (this.priceRange[1] - this.maxPrice) / 100;
    this.right=this.rightval+'%';
    this.filterData();
  }else{
    this.maxPrice=this.maxPrice+1000;
  }
  }

  get filteredData(): Event[] {
    if(this.selectedCategory.length === 0 && 
      this.selectedLanguage.length === 0 && 
      this.minPrice===0 && 
      this.maxPrice===10000 && 
      this.dateSelected.length === 0){
      return this.events;
    }
    else {
      return this.filterData();
    }
    
  }
  filterData():Event[]{
    this.allList=[];
    this.commonValues=[];
    if (this.selectedCategory.length === 0) {
      this.categoryList = this.events;
    } else {
      this.categoryList=[];
      this.selectedCategory.forEach(category => {
        for(const event of this.events){
          if(event.eventCatagory === category){
            this.categoryList.push(event);
          }
        }
    });
    }
    if (this.selectedLanguage.length === 0) {
      this.languageList = this.events;
    } else {
      this.languageList=[];
      for(const event of this.events){
        for(const language of event.eventLanguages){
          if(language === this.selectedLanguage){
            this.languageList.push(event);
          }
        }
      }
    }
    for(const event of this.categoryList){
      for(const item of this.languageList){
        if(event._id === item._id){
          this.commonValues.push(event);
        }
      }
    }
    for(const event of this.commonValues){
      if(Number(event.eventTicketPrice) >= this.minPrice && Number(event.eventTicketPrice) <= this.maxPrice){
          this.allList.push(event);
      }
    }
    if(this.dateSelected.length > 0){
      this.allList = this.filterDataByDate(this.allList,this.dateSelected)
    }
    return this.allList;
  }
  filterDataByDate(data: Event[], targetDate: string): any[] {
    return data.filter(item => {
      // Assuming each item has a 'date' property
      const itemDate = new Date(item.eventStartDate);
      const targetDate1 = new Date(targetDate);
      return itemDate.toDateString() === targetDate1.toDateString();
    });
  }
  clearFilter(){
      this.selectedCategory =[] ; 
      this.selectedLanguage ='' ; 
      this.minPrice=0 ; 
      this.maxPrice=10000 ; 
      this.dateSelected='';
  }
  onSortByChange(sortOption: string) {
    this.sortBy = sortOption;
    if(this.sortBy===''){
      this.fetchData()
    }else
      this.sortData();
  }
  navigateToEventDetails(id:String){
    this.router.navigate(['/event-details/'+id]);
  }
  // Function to sort the data based on the selected option
  sortData() {
    this.eventService.getSortedEvent(this.sortBy).subscribe((observer)=>{

      if(observer.statusCode==200){
        this.events=observer.data;
      }else{
        this.toasterService.error(observer.message,"",{timeOut:3000});
      }
    })
    
  }
}

