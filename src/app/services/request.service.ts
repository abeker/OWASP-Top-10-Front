import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient,
              private store: Store<fromApp.AppState>) { }

  sendRequest(requestList): Observable<any> {
    return this.http.post(this.baseUrl + `ads/requests`, requestList);
  }

  approveRequest(requestId: string): Observable<any> {
    this.getToken();
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/approve`, requestId, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  denyRequest(requestId: string): Observable<any> {
    this.getToken();
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/deny`, requestId, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  payRequest(requestId: string): Observable<any> {
    this.getToken();
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/pay`, requestId, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  dropRequest(requestId: string): Observable<any> {
    this.getToken();
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/drop`, requestId, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  getAgentRequests(agentId:string, requestStatus:string): Observable<any> {
    return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/agent/" + agentId);
  }

  getUserRequests(userId:string, requestStatus:string): Observable<any> {
    return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/simple-user/" + userId);
  }

  getToken(): void {
    this.subscriptionUser = this.store.select('auth').subscribe(userData => {
      this.activeUserToken = userData.user.token;
    });
  }
}
