import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  url: string = environment.apiBaseUrl + '/User/';

  signOUt() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
  signUp(userObj: any) {
    return this.http.post<User>(`${this.url}register`, userObj);
  }
  login(loginObj: any) {
    return this.http.post<User>(`${this.url}authenticate`, loginObj);
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
