import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;
  private baseUrl = environment.baseUrl;

  constructor(private store: Store<fromApp.AppState>,
              private http: HttpClient) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, 3600000);
  }

  login(loginRequest): Observable<any> {
    return this.http.put(this.baseUrl + `auth/users/login`, loginRequest);
  }

}
