import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimpleUserService {

  private baseUrl = environment.baseUrl;
  subscriptionUser: Subscription;
  activeUserToken: string;

  constructor(private http: HttpClient) { }

  getAllRegistrationRequestsByStatus(userStatus): Observable<any> {
    return this.http.get(this.baseUrl + `auth/simple-users/` + userStatus + "/status");
  }
}
