import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ipPath} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  baseUrl=ipPath+"email/";

  constructor(private http:HttpClient) { }

  bookYourEvent(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"bookrequest",data);
  }
  sendMailForListYourEvent(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"listyoureventmail",data);
  }
  WelcomeEmailForOrganizer(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"organizerwelcomeemail",data);
  }
  WelcomeEmailForCustomer(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"customerwelcomeemail",data);
  }
  addEventMail(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"organizereventaddeditemail",data);
  }
  approvedEventMail(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"organizereventapprovedemail",data);
  }
  emailForOtp(data:any):Observable<any>{
    
    return this.http.post(this.baseUrl+"emailotpverification",{data});
  }
}
