import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { JwtHelperService } from '@auth0/angular-jwt';


const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/authenticate`, { username, password })
      .pipe(map(user => {
        user.username=username;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log(this.currentUser);
        return user;
      }));
  }
  jwtIsExpired() {

    if (!this.currentUserValue) {
      return true;
    }
    else {
      return helper.isTokenExpired((this.currentUserValue.token));
    }
  }

  logout() {
    // remove user from local storage to log user out
    console.log("logout#");
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  isAdmin() {

    const usr = this.currentUserValue;
    if (usr != null) {
      if (helper.decodeToken(usr.token).UserType === "[admin]") {
        return true;
      }
      else {
        return false;
      }
      return false;
    }
  }
}
export interface User {
  username: string;
  password: string;
  token?: string;
}
