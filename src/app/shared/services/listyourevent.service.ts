import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ipPath} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListyoureventService {
  
 
  
 baseUrl=ipPath+"list-your-event/";


  constructor(private http:HttpClient) { }
  
   bookYourEvent(data:any):Observable<any> {
    return this.http.post(this.baseUrl+"bookyourevent",data);
  }

  createListYourEvent(data:any):Observable<any> {
    return this.http.post(this.baseUrl+"addlistyourevent",data);
  }

  getAllListEventEnquiries():Observable<any>{
    return this.http.get(this.baseUrl+"getalllistyourevents");
  }

  deleteEnquiry(id:any):Observable<any>{
    return this.http.delete(this.baseUrl+"deletelistyourevent/"+id);
  }
  
}
