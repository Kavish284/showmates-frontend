import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { EventService } from 'src/app/shared/services/event.service';
import { EmailService } from 'src/app/shared/services/email.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/services/session.service';
import { Profile } from '../../../user/models/profile';
import { ListyoureventService } from 'src/app/shared/services/listyourevent.service';

@Component({
  selector: 'app-list-yourevent',
  templateUrl: './list-yourevent.component.html',
  styleUrls: ['./list-yourevent.component.css']
})
export class ListYoureventComponent {
  catagories: Array<any>;
  eventForm: FormGroup;
  data: Profile;
  name: string = '';
  number: string = '';
  flag = false;
  constructor(private listYourEventService: ListyoureventService, private sessionService: SessionService, private router: Router, private toasterService: ToastrService, private formBuilder: FormBuilder, private categoryService: CategoryService, private eventService: EventService, private emailService: EmailService) {

    this.createEventForData();
    this.categoryService.getAllCatagories().subscribe((observer) => {
      this.catagories = observer.data;
    })

  }
  createEventForData() {
    this.eventForm = this.formBuilder.group({
      yourName: [this.name, [Validators.required,this.LengthValidator]],
      yourContactNumber: [this.number, [Validators.required, Validators.minLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
      yourEmail: ['', [Validators.required, this.EmailValidator]],
      eventCatagory: ['select an option', Validators.required],
      numberOfPeople: ['', [Validators.required,  Validators.min(5)]]
    })
    this.flag = true;

  }

  EmailValidator(control: FormControl) {
    const email = control.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      return { invalidEmail: true };
    }
    return null;
  }
  
  LengthValidator(control: FormControl) {
    const catagory = control.value;
    if (!catagory || !(catagory.length >= 2 && catagory.length <= 50)) {

      return { invalidLength: true };
    }
    return null;
  }

  async onSubmit() {

    if (this.eventForm.valid) {
      const data = {
        yourName: this.eventForm.get('yourName')?.value.trim(),
        yourContactNumber: this.eventForm.get('yourContactNumber')?.value.trim(),
        eventCatagory: this.eventForm.get('eventCatagory')?.value.trim(),
        numberOfPeople: this.eventForm.get('numberOfPeople').value,
        yourEmail:this.eventForm.get('yourEmail')?.value.trim()
      }
      
      await this.listYourEventService.createListYourEvent(data).subscribe(async (observer) => {


        if (observer.statusCode == 200) {
          
          this.emailService.sendMailForListYourEvent(data).subscribe();
          this.toasterService.success(observer.message, "", { timeOut: 3000 });
          //this.router.navigate(["/"]);
        } else {
          this.router.navigate(["/"]);
          this.toasterService.error(observer.message, "", { timeOut: 30000 });
         
          //this.router.navigate(["admin/add-event"]);
        }
      })
    } else {
      this.router.navigate(["/"]);
      this.toasterService.error("All fields are required to process your event listing request", "", { timeOut: 3000 });
    }
    document.getElementById("closeAddEvent")?.click();
  }
}
