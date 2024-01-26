import { AfterViewInit, Component, HostListener, Input } from '@angular/core';
import { SessionService } from './../../services/session.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/shared/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { Profile } from 'src/app/user/models/profile';

@Component({
  selector: 'app-userheader',
  templateUrl: './userheader.component.html',
  styleUrls: ['./userheader.component.css']
})
export class UserheaderComponent implements AfterViewInit {
  isSearchOpen: boolean = false;
  eventName: string = '';
  homepage: boolean = false;
  allevent: boolean = false;
  listye: boolean = false;
  parentComponent: string = '';
  events: Array<Event> = [];
  profile: Profile;
  mobile: boolean = false;
  sideMenuOpen: boolean = false;
  @Input() parentName: string;
  constructor(private sessionService: SessionService,private encryptionService:EncryptionService,private router: Router, private eventService: EventService, private toasterService: ToastrService) {
    if (this.sessionService.isLoggedIn()) {
      const userId= localStorage.getItem("id");
   

      this.sessionService.getUserById(userId).subscribe((observer) => {


        if (observer.statusCode == 200) {
          this.profile = observer.data;
        } else {
          this.profile = null;
        }
      })
    }
    this.checkViewportWidth();
  }
  checkViewportWidth() {
    if (window.innerWidth <= 768) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
  openSideMenu() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewportWidth();
  }
  ngAfterViewInit(): void {
    if (this.parentName === 'event-list') {
      this.homepage = false;
      this.listye = false;
      this.allevent = true;
    }
    else if (this.parentName === 'homepage') {
      this.homepage = true;
      this.listye = false;
      this.allevent = false;
    }
  }
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  findEvent() {
    document.getElementById("closeSearch")?.click();
    const data = {
      from: 'search',
      searchText: this.eventName
    }

    if (this.parentName === 'event-list') {
      this.router.navigate(['/event-list'], { queryParams: data });
    } else {
      this.router.navigate(['/event-list'], { state: { data: data } });
    }
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    document.body.classList.add('sideopen');
  }

  closeNav() {
    document.getElementById("sidenav")?.click();
  }
  async logout() {
    let result = await this.sessionService.logout();

    if (result) {
      if (window.location.href === 'showmates.in') {
        window.location.reload();
      } else {
        this.router.navigate([""]);
      }
    } else {
      this.toasterService.error("error occured while performing logout!,please try again after sometime", "", { timeOut: 3000 });
    }
  }
  navigateToList(category: String) {
    document.getElementById('closeSearch')?.click();
    const data = {
      from: 'homeCategory',
      category: category,
    }
    if (this.parentName === 'event-list') {
  
      this.router.navigate(['/event-list'], { queryParams: data });
    } else {
      this.router.navigate(['/event-list'], { state: { data: data } });
    }
  }
}
