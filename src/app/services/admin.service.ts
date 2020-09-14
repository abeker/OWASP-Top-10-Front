import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  approveRegistrationRequest(id): Observable<any> {
    return this.http.put(this.baseUrl + `auth/admins/approve`, id);
  }

  danyRegistrationRequest(id): Observable<any> {
    return this.http.put(this.baseUrl + `auth/admins/deny`, id);
  }
}
