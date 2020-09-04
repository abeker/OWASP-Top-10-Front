import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient,
              private store: Store<fromApp.AppState>) { }

  sendComment(adId: string, commentText: string): Observable<any> {
    this.getToken();
    return this.http.post(this.baseUrl + `ads/comments/ad/`+ adId, commentText, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  getCommentsOfAd(adId: string): Observable<any> {
    this.getToken();
    return this.http.get(this.baseUrl + `ads/comments/`+ adId, {
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
