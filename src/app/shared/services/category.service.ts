import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import {ipPath} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  
  baseUrl=ipPath+'catagory/';
  categories:any;
  
  constructor(private http:HttpClient) { }

  addCatagory(data:FormData):Observable<any>{

    return this.http.post(this.baseUrl+"addcatagory",data);
  }

  getCatagoryById(id:any):Observable<any>{
    return this.http.get(this.baseUrl+"getcatagorybyid/"+id)
  }

  updateCatagory(id:string,data:FormData):Observable<any>{
    return this.http.put(this.baseUrl+"updatecatagory/"+id,data);
  }

  deleteCatagory(id:string):Observable<any>{
    return this.http.delete(this.baseUrl+"deletecatagory/"+id);
  }

  getAllCatagories():Observable<any>{
    if(this.categories){
      return of(this.categories);
    }
    return this.http.get(this.baseUrl+"getcatagories").pipe(tap(res=>this.categories=res));
  }
}