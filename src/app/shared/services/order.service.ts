import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ipPath } from 'src/environments/environment';
import { Order } from '../../user/models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = ipPath + "order/";
  private tempOrder : any;
  constructor(private http: HttpClient) { }
  setOrder(data: any) {
    this.tempOrder = data;
  }

  getOrder(): any {
    return this.tempOrder;
  }
  intilizeOrder(data: Order): Observable<any> {
    return this.http.post(this.baseUrl + "initorder", data);
  }
  getOrderById(id:string):Observable<any> {
    return this.http.get(this.baseUrl+"getorderbyid/"+id);
  }
  updateUserId(oId:string,uId:string): Observable<any> {
    const data ={
      "orderId":oId,
      "userId":uId,
    };
    return this.http.post(this.baseUrl + "updateuserid", data);
  }
  getOrderByUserId(id:string):Observable<any> {
    return this.http.get(this.baseUrl+"getorderbyuserid/"+id);
  }
  getPreviousOrderByUserId(id:string):Observable<any> {
    return this.http.get(this.baseUrl+"getpreviousorderbyuserid/"+id);
  }
  paymentSuccesForFreeEvents(data:any):Observable<any> {
    const merchantTransactionId={
      "merchantTransactionId":data
    }
    return this.http.post(this.baseUrl+"freeEventQrGeneration",merchantTransactionId);
  }
}
