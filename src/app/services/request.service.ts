import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { ActivatedRoute } from '@angular/router';

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
    this.getToken();
    return this.http.post(this.baseUrl + `ads/requests`, requestList, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
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
    return this.http.put(this.baseUrl + `ads/requests/`+null+`/drop`, null, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  getAgentRequests(agentId:string, requestStatus:string): Observable<any> {
    this.getToken();
    return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/agent/" + agentId, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
  }

  getUserRequests(userId:string, requestStatus:string): Observable<any> {
    this.getToken();
    let unsafeUserRequest = {
      "requestStatus" : requestStatus,
      "customer_id" : userId
    }
    return this.http.put(this.baseUrl + `ads/requests/` + requestStatus + "/simple-user/" + userId, unsafeUserRequest, {
      headers: new HttpHeaders ({
        'Auth-Token' : this.activeUserToken
      })
    });
    // SAFE REQUEST
    // return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/simple-user/" + userId, {
    //   headers: new HttpHeaders ({
    //     'Auth-Token' : this.activeUserToken
    //   })
    // });
  }

  getToken(): void {
    this.subscriptionUser = this.store.select('auth').subscribe(userData => {
      this.activeUserToken = userData.user.token;
    });
  }
}
