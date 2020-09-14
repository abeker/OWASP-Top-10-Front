import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BrowserFingerprint } from './../interfaces/browserFingerprint.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  getUser(email: string): Observable<any> {
    return this.http.get(this.baseUrl + `auth/users/` + email + "/mail");
  }

  getUserQuestion(email: string): Observable<any> {
    return this.http.get(this.baseUrl + `auth/users/` + email + "/security-question");
  }

  checkPassword(password: string): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/users/check-password/' + password);
  }

  checkAttempts(browserFingerprint: BrowserFingerprint): Observable<any> {
    return this.http.put(this.baseUrl + `auth/users/check-attempts`, browserFingerprint);
  }

  changePassword(requestBody): Observable<any> {
    return this.http.put(this.baseUrl + 'auth/users/change-password', requestBody);
  }

  sendInfoRequest(username): Observable<any> {
    return this.http.get(this.baseUrl + 'auth/users/'+ username +'/info');
  }

}
