import { AfterViewInit, Component, ElementRef, OnInit, Renderer2,TemplateRef, ViewChild  } from '@angular/core';
import { DomSanitizer, Meta, SafeResourceUrl } from '@angular/platform-browser';
import { EventService } from '../../../shared/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { ipPath } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import 'moment-timezone';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BlogService } from '../../../shared/services/blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  blog;
  ipPath = ipPath;
  constructor(private meta: Meta,private modalService: NgbModal,private renderer: Renderer2, private el: ElementRef,private datePipe: DatePipe,private dialog: MatDialog,private sanitizer: DomSanitizer, private blogService: BlogService, private toasterService: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    
    //checking click event listner
    this.blogService.getBlogById(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((observer) => {
      if (observer.statusCode == 200) {
        this.blog = observer.data;
        
        this.meta.addTag({ name: 'title', content: this.blog.blogTitle });
        this.meta.addTag({ name: 'description', content: this.blog.blogDescription });
        this.meta.addTag({ name: 'keywords', content: 'angular, dynamic, meta tags' });

  }})

  }
}
