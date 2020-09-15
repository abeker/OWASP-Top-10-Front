import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/user.model';
import * as AuthActions from './auth.actions';

export interface SignupResponseData {
  id: string
  username: string;
  firstName: string;
  lastName: string;
  userRole: string;
}

export interface AuthResponseData {
  id: string
  token: string;
  username: string;
  tokenExpiresIn: string;
  userRole: string;
  agentHasPriceList: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string,
  userRole: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(userId, email, token, expirationDate, userRole);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.LoginSuccess ({
    username: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    userRole: userRole,
    redirect: true
  });
};

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.put<AuthResponseData>(
        environment.baseUrl + 'auth/users/login',
        {
          username: authData.payload.username,
          password: authData.payload.password,
          isSQLI: authData.payload.isSQLI,
          isDictionaryAttack: false,
          browserFingerprint: authData.payload.browserFingerprint
        })
      .pipe(
          map(responseData => {
            return handleAuthentication(+responseData.tokenExpiresIn, responseData.username, responseData.id, responseData.token, responseData.userRole);
          }),
          catchError(responseError => {
            return of(new AuthActions.LoginFail({
              message: responseError.error,
              autoLogin: false,
              redirect: false
            }));
          })
      );
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http.post<SignupResponseData>(
        environment.baseUrl + 'auth/simple-users',
        {
          username: authData.payload.username,
          firstName: authData.payload.firstName,
          lastName: authData.payload.lastName,
          password: authData.payload.password,
          rePassword: authData.payload.password,
          ssn: authData.payload.ssn,
          address: authData.payload.address,
          securityQuestion: authData.payload.securityQuestion,
          securityAnswer: authData.payload.securityAnswer
        })
      .pipe(
          map(() => {
            this.message.success('Registration request successfully sent.');
            return new AuthActions.SignupSuccess();
          }),
          catchError(responseError => {
            this.message.warning(responseError.error);
            return of(new AuthActions.SignupFail(responseError.error));
          })
      );
    })
  );

  @Effect({ dispatch: false })
  authLoginFail = this.actions$.pipe(
    ofType(AuthActions.LOGIN_FAIL),
    tap((authFailAction: AuthActions.LoginFail) => {
      if(!authFailAction.payload.autoLogin){
        this.message.warning(authFailAction.payload.message);
        if(authFailAction.payload.redirect) {
          this.router.navigate(['/auth/limit-redirect']);
        }
      }
      if(authFailAction.payload.message.indexOf("attempts") !== -1) {
        this.router.navigate(['/auth/limit-redirect']);
      }
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    tap((authSuccessAction: AuthActions.LoginSuccess) => {
      if(authSuccessAction.payload.redirect && authSuccessAction.payload.userRole === 'SIMPLE_USER') {
        this.router.navigate(['/dashboard/ads']);
      }
      else if(authSuccessAction.payload.redirect && authSuccessAction.payload.userRole === 'AGENT') {
        this.router.navigate(['/dashboard/agent-ads']);
      } else if(authSuccessAction.payload.redirect){
        this.router.navigate(['/dashboard']);
      }
    })
  );

  @Effect({ dispatch: false })
  authRedirectSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_SUCCESS),
    tap(() => {
      this.router.navigate(['/auth/login']);
    })
  );

  @Effect()
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    switchMap(() => {
        return this.http.get(environment.baseUrl + 'auth/users/logout')
        .pipe(
          map(() => {
            return new AuthActions.LogoutEnd("Successful logout.");
          }),
          catchError(() => {
            return of(new AuthActions.LogoutEnd("Fail logout."));
          })
        );
      })
  );

  @Effect({ dispatch: false })
  authLogoutEnd = this.actions$.pipe(
    ofType(AuthActions.LOGOUT_END),
    tap(() => {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      if(localStorage.getItem('userData') !== null) {
        const userData: {
          username: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
          userRole: string
        } = JSON.parse(localStorage.getItem('userData'));

        if(userData !== null) {
          const loadedUser = new User(
            userData.username,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate),
            userData.userRole
          );

          if(loadedUser.token){
            const remainingDuration:number =
                new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(remainingDuration);
            return new AuthActions.LoginSuccess({
              username: userData.username,
              userId: userData.id,
              token: userData._token,
              expirationDate: new Date(userData._tokenExpirationDate),
              userRole: userData.userRole,
              redirect: false,
            });
          }
        }
      } else {
        return new AuthActions.LoginFail({
          message: "User is not logged in.",
          autoLogin: true,
          redirect: false
        });
      }
    })
  );

   constructor(private actions$: Actions,
               private http: HttpClient,
               private router: Router,
               private authService: AuthService,
               private message: NzMessageService) {}
}
