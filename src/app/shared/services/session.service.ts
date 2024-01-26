import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Profile } from '../../user/models/profile';
import {ipPath} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // public loggedIn = new BehaviorSubject<boolean>(false);
  // public role = new BehaviorSubject<string>('');
  baseUrl=ipPath+"authenticate/";
  urlForUser=ipPath+"api/";

  

  constructor(private router:Router,private http:HttpClient) {

  }

  addUser(data:any):Observable<any>{
    return this.http.post(this.urlForUser+"addorganizer",data);
  }

  addWhatsappNumber(number:string):Observable<any>{
    return this.http.post(this.urlForUser+"addwhatsappnumber/"+number,null);
  }

  getWhatsappNumber():Observable<any>{
    return this.http.get(this.urlForUser+"getallwhatsappnumber");
  }
  deleteUser(id:any):Observable<any>{
    return this.http.delete(this.urlForUser+"deleteuserbyid/"+id);
  }

  deactivateUserAccount(id:any):Observable<any>{
    return this.http.patch(this.urlForUser+"deactivateuser/"+id,null);
  }
  getAllOrganizers():Observable<any>{
    return this.http.get(this.urlForUser+"getallorganizers");
  }
  getAllCustomers():Observable<any>{
    return this.http.get(this.urlForUser+"getallusers");
  }

  //forcustomer
  loginWithPhone(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"loginbyphone",{phone:data.phone,role:data.role});
  }

  //for admin
  loginWithEmailAndPassword(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"loginbyemailandpassword",data);
  }
  //forcustomer
  loginWithEmail(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"loginbyemail",data);
  }

  sendOTP(number:any):Observable<any>{
    return this.http.post(this.baseUrl+"sendotp",{number});
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    return true;
  }

   isLoggedIn(): Observable<boolean> {
    const id=localStorage.getItem("id");
    const token=localStorage.getItem("token");
    const expiry=localStorage.getItem("expiresIn");

    return this.getUserById(id).pipe(
      map(user=>{

        if(user.data && token && new Date(parseInt(expiry)*1000)>new Date()){
          return true;
        }
        return false;
      })
    )
  }

  getRole(): Observable<string> {
    const id=localStorage.getItem("id");

    return this.getUserById(id).pipe(
      map(user=>{

        if(user.data){
          return user.data.role;
        }
        return null;
      })
    )
  }

  getUserById(id:string):Observable<any>{
    return this.http.get(this.urlForUser+"getuserbyid?id="+id)
  }

  getUserByEmail(data:Profile):Observable<any>{
    return this.http.get(this.baseUrl+"getuserbyemail?email="+data.email+"&role="+data.role);
  }

  updateProfile(id:string,data:Profile):Observable<any>{
  
    return this.http.put(this.urlForUser+"updateuser/"+id,data);

  }


}

