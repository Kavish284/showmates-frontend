import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
declare var $: any;
@Directive({
  selector: '[appJquiDatepicker]'
})
export class DatepicketDirective implements OnChanges {
  @Input() selectedDate: Date;
  @Input() availableTime: string[];
  @Input() availableDates: Date[]; // Input for available dates
  @Output() selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableDates'] && changes['availableDates'].currentValue) {

      this.updateDatepickerOptions();
    }
  }
  ngOnInit() {
    $(this.el.nativeElement).datepicker({
      onSelect: (dateText: string) => {
        const selectedDateObject = new Date(dateText);
        this.selectedDate = selectedDateObject;
        this.selectedDateChange.emit(selectedDateObject);
      }
    });

    // Initially set the datepicker options based on availableDates
    beforeShowDay: this.beforeShowDay.bind(this)
  }
  private updateDatepickerOptions() {
    // Update the datepicker options when availableDates change
    $(this.el.nativeElement).datepicker('option', 'beforeShowDay', this.beforeShowDay.bind(this));
  }

  // // Function to determine if a date is available
   private beforeShowDay(date: Date) {
     const currentDate = new Date();
     const [time, ampm] = this.availableTime[0].split(' ');
     let [hours, minutes] = time.split(':').map(Number);
     if (ampm.toLowerCase() === 'pm' && hours < 12) {
       hours += 12;
     }

     const validDates = this.availableDates.filter(availableDate => {
       availableDate.setHours(hours);
       availableDate.setMinutes(minutes);


       return availableDate >= currentDate;
     });

     return [validDates.some(availableDate => availableDate.toDateString() === date.toDateString()), ''];
   }
  /* private beforeShowDay(date: Date) {
    const currentDate = new Date();
    
    const validDates = this.availableDates.filter(availableDate => {
      const isValidDate = this.availableTime.some(time => {
        const [timeHours, timeMinutes] = time.split(':').map(Number);
        const dateCopy = new Date(availableDate);
        dateCopy.setHours(timeHours, timeMinutes, 0, 0);
        return dateCopy >= currentDate;
      });
      
      return isValidDate;
    });
  
    return [validDates.some(availableDate => availableDate.toDateString() === date.toDateString()), ''];
  } */

}
