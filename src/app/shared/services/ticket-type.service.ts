import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ipPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {
  

  baseUrl=ipPath+"ticket/";

  constructor(private http:HttpClient) { }

  addTicketType(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"addtickettype",data);
  }
  getTicketsById(id: any) {
    return this.http.get(this.baseUrl+"getticketbyid/"+id)
  }
  getTicketsByEvent(id:any):Observable<any>{
    return this.http.get(this.baseUrl+"getticketsbyevent/"+id)
  }

  changeTicketStatus(id:any,status):Observable<any>{
    return this.http.patch(this.baseUrl+"changeticketstatus",{id:id,ticketStatus:status});
  }

  deleteTicketType(id:any):Observable<any>{
    return this.http.delete(this.baseUrl+"deletetickettype/"+id);
  }
  

}
