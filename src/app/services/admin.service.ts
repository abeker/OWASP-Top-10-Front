import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  approveRegistrationRequest(id): Observable<any> {
    return this.http.put(this.baseUrl + `auth/admins/approve`, id);
  }

  danyRegistrationRequest(id): Observable<any> {
    return this.http.put(this.baseUrl + `auth/admins/deny`, id);
  }
}
