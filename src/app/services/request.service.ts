import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  sendRequest(requestList): Observable<any> {
    return this.http.post(this.baseUrl + `ads/requests`, requestList);
  }

  approveRequest(requestId: string): Observable<any> {
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/approve`, requestId);
  }

  denyRequest(requestId: string): Observable<any> {
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/deny`, requestId);
  }

  payRequest(requestId: string): Observable<any> {
    return this.http.put(this.baseUrl + `ads/requests/`+requestId+`/pay`, requestId);
  }

  dropRequest(requestId: string): Observable<any> {
    return this.http.put(this.baseUrl + `ads/requests/`+null+`/drop`, requestId);
  }

  getAgentRequests(agentId:string, requestStatus:string): Observable<any> {
    return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/agent/" + agentId);
  }

  getUserRequests(userId:string, requestStatus:string): Observable<any> {
    let unsafeUserRequest = {
      "requestStatus" : requestStatus,
      "customer_id" : userId
    }
    return this.http.put(this.baseUrl + `ads/requests/` + requestStatus + "/simple-user/" + userId, unsafeUserRequest);
    // SAFE REQUEST
    // return this.http.get(this.baseUrl + `ads/requests/` + requestStatus + "/simple-user/" + userId);
  }

}
