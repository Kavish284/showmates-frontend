import { Component, Input, Output, EventEmitter, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatepicketDirective } from 'src/app/shared/services/datepicket.directive';
import { Location } from '@angular/common'
@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.css']
})
export class DateSelectionComponent implements OnInit {

  @ViewChild(DatepicketDirective) datepickerDirective: DatepicketDirective;
  @Input() availableDates: Date[];
  @Input() availableTimes: string[];
  @Output() dateTimeConfirmed: EventEmitter<{ date: Date; time: string }> = new EventEmitter<{ date: Date; time: string }>();

  selectedDate: Date;
  selectedTime: string = '';
  clicked: Boolean = false;
  constructor(private location: Location) {

  }
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.subscribeToSelectedDateChange();
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event): void {
    this.location.replaceState(this.location.path());
  }
  // Method to subscribe to the emitted date
  private subscribeToSelectedDateChange() {
    this.datepickerDirective.selectedDateChange.subscribe((date: Date) => {


      this.selectedDate = date;

      for (let i = 0; i < this.availableDates.length; i++) {

        if (this.availableDates[i].getDate() == this.selectedDate.getDate()) {

          this.selectedTime = this.availableTimes[i];
        }
      }
    });
  }
  pickTime(time: string) {
    this.clicked = !this.clicked;
    this.selectedTime = time;
  }
  setSelectedDate(value: Date) {
    this.selectedDate = value;
    // You can perform any additional logic here if needed
  }
  getSelectedDate(): Date {
    return this.selectedDate;
  }

  confirmDateTime() {
    if (this.selectedDate && this.selectedTime) {
      document.getElementById('closeDate')?.click();
      const selectedDateObject = new Date(this.selectedDate);
      this.dateTimeConfirmed.emit({ date: selectedDateObject, time: this.selectedTime });
    } else {
      alert('Please select both date and time.');
    }
  }
}
