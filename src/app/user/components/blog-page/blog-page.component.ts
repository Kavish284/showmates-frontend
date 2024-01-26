import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../shared/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../models/blog';
import { ipPath } from 'src/environments/environment';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent{

  blogs:Blog[] = [];
  ipPath = ipPath;
  constructor(private blogService: BlogService, private toastrService: ToastrService, private router: Router) {}

  ngOnInit():void{
    this.fetchInitialData();
  }

  async fetchInitialData() {
    this.blogService.getAllBlog().subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.blogs = response.data;
        } else {
          //this.toastrService.error(response.message, '', { timeOut: 3000 });
        }
      },
      (error) => {
        //this.toastrService.error('An error occurred. Please try again.', '', { timeOut: 3000 });
      }
    );
  }
  navigateToBlogDetails(id:String){
    this.router.navigate(['/blog-details/' + id]);
  }
}
