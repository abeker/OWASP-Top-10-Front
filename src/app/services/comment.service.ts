import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  sendComment(adId: string, commentText: string): Observable<any> {
    return this.http.post(this.baseUrl + `ads/comments/ad/`+ adId, commentText);
  }

  getCommentsOfAd(adId: string): Observable<any> {
    return this.http.get(this.baseUrl + `ads/comments/`+ adId);
  }
}
