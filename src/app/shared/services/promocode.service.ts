import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ipPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromocodeService {

  baseUrl=ipPath+"promocode/";

  constructor(private http:HttpClient) { }

  addPromocode(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"addpromocode",data);
  }

  changePromocodeStatus(data:any):Observable<any>{
    return this.http.patch(this.baseUrl+"changepromocodestatus",data);
  }

  deletePromocode(promocodeId:any):Observable<any>{
    return this.http.delete(this.baseUrl+"deletepromocode/"+promocodeId);
  }
  
  getPromocodesForUser(userId:any):Observable<any>{
    return this.http.get(this.baseUrl+"getpromocodebyuser/"+userId);
  }

  changeActiveStatusForPromocode(id:any,status:boolean):Observable<any>{
      return this.http.patch(this.baseUrl+"changepromocodestatus",{id:id,status:status});
  }

  getPromocodeById(id:any):Observable<any>{
    return this.http.get(this.baseUrl+"getpromocodebyid/"+id);
  }
}
