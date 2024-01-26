import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  whatsappNumber:string='';
  mobileView: boolean = false;

  constructor(private toasterService:ToastrService, private router: Router , private sessionService:SessionService){
    //checking for mobile view
    if (window.innerWidth <= 768) {
      this.mobileView= true;
    }
  }
  navigateToList(category:String){
    const data = {
      from:'homeCategory',
      category:category,
    }
    this.router.navigate(['/event-list'], { state: { data: data } });
  }
  navigateToHome(){
    this.router.navigate(["/"]);
  }

  addNumber(){
    const pattern = /^[6-9]\d{9}$/;

    if(pattern.test(this.whatsappNumber.trim())){

      this.sessionService.addWhatsappNumber(this.whatsappNumber.trim()).subscribe((observer)=>{
        if(observer.statusCode==200){
          this.toasterService.success(observer.message,"",{timeOut:3000});
        }else{
          this.toasterService.error(observer.message,"",{timeOut:3000});
        }
      })
    }else{
      //handle error in form
      this.toasterService.error("Please enter valid phone number!","",{timeOut:3000});
    }
  }
  openPhonepe(){
    const apiUrl = 'http://localhost:3000/order/initphonepe';
    const queryParams = {
      'mobileNumber': '9999999999',
      'amount': '1000',
      'merchantUserId': 'MUID123'
    };
    this.openNewWindowWithParams(apiUrl, queryParams);
  }
  openNewWindowWithParams(externalUrl: string, queryParams: { [key: string]: string }): void {
    // Create a query string from the queryParams object
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    // Append the query string to the external URL
    const urlWithParams = externalUrl + '?' + queryString;

    // Use window.open to open a new browser window or tab
    window.open(urlWithParams,'_self');
  }
}