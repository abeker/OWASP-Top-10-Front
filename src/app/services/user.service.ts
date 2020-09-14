import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { BrowserFingerprint } from './../interfaces/browserFingerprint.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient,
              private store: Store<fromApp.AppState>) { }

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
    this.getToken();
    return this.http.get(this.baseUrl + 'auth/users/'+ username +'/info', {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  getToken(): void {
    this.subscriptionUser = this.store.select('auth').subscribe(userData => {
      this.activeUserToken = userData.user.token;
    });
  }
}
