import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import {ipPath} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BannerService {

  baseUrl=ipPath+"banner/";
  activeBanner:any;
  allBanner:any;

  constructor(private http:HttpClient) { }

  addBannerImages(data:FormData):Observable<any>{
    return this.http.post(this.baseUrl+"banner-images",data);
  }

  getAllBannerImages():Observable<any>{
     if (this.allBanner) {
      return of(this.allBanner);
    } else {
      return this.http.get(this.baseUrl + "getall-banner-images").pipe(tap(res => this.allBanner = res));
    }
  }

  getAllActiveBannerImages():Observable<any>{
    if (this.activeBanner) {
      return of(this.activeBanner);
    } else {
      return this.http.get(this.baseUrl + "getall-active-banner-images").pipe(tap(res => this.activeBanner = res))
    }
  }

  setBannerImageAsActive(id:any):Observable<any>{
    return this.http.patch(this.baseUrl+"setimageactive/"+id,null);
  }

  deactivateBannerImage(id:any):Observable<any>{
    return this.http.patch(this.baseUrl+"deactivatebannerimage/"+id,null);
  }

  deleteBannerImage(id:any):Observable<any>{
    return this.http.delete(this.baseUrl+"deletebannerimage/"+id);
  }
}
