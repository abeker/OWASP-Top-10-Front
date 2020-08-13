import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(loginRequest): Observable<any> {
    return this.http.put(this.baseUrl + `auth/users/login`, loginRequest);
  }

}
