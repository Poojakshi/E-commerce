import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor( private as : AuthService, private router : Router) { }
   path!: import("@angular/router").ActivatedRouteSnapshot[];
   route!: import("@angular/router").ActivatedRouteSnapshot;
  canActivate(path: any, route: any): boolean | Observable<boolean> |  Promise<boolean> {
    return new Promise (resolve =>
      {
        this.as.user.subscribe( user =>
          {
            if(user) resolve(true)
            else
            this.router.navigate(['/login'])
          })
      })
  }
  // path: import ("@angular/router").ActivatedRouteSnapshot[];
  // route:import ("@angular/router").ActivatedRouteSnapshot;
  
  
}
