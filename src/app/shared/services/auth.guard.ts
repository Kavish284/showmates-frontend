import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sessionService:SessionService,private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data['roles'] as string[];
    return this.sessionService.isLoggedIn().pipe(

      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.sessionService.getRole().pipe(

            map(role => {

              if (roles.includes(role)) {
                return true;
              } else {
                if(role=='customer')
                  this.router.navigate([""]);
                if(role=='organizer')
                  this.router.navigate(["organizer"]);
                return false;
              }
            })
          );
         
        } else {
          this.router.navigate([""]);
          return of(false);
        }
      })
    );
  }

}
