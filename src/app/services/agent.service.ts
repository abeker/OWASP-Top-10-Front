import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  createAgent(createAgentRequest): Observable<any> {
    return this.http.post(this.baseUrl + `auth/agents`, createAgentRequest);
  }

  getAgentAds(agentId: string): Observable<any> {
    return this.http.get(this.baseUrl + `ads/ads/`+agentId+'/ads');
  }

}
