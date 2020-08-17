import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createAgent(createAgentRequest): Observable<any> {
    return this.http.post(this.baseUrl + `auth/agents`, createAgentRequest);
  }
}
