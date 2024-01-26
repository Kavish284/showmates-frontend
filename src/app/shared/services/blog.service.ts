import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ipPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl=ipPath+"blog/";
  constructor(private http:HttpClient) { }

  getAllBlog(): Observable<any> {
    return this.http.get(this.baseUrl + "getallblogs/")
  }
  getBlogById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "getblogbyid/"+id)
  }
}
