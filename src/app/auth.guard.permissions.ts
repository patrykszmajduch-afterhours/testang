﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';



@Injectable({ providedIn: 'root' })
export class AuthGuardPermissions implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            if(this.authenticationService.jwtIsExpired()){
                this.authenticationService.logout();
            }
            else{
                return  this.authenticationService.isAdmin();
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    logout(){
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
    
}