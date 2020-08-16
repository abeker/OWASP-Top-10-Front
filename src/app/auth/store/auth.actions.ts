import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const SIGNUP_START = '[Auth] Sign Up Start';
export const SIGNUP_SUCCESS = '[Auth] Signup Success';
export const SIGNUP_FAIL = '[Auth] Signup Fail';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {
    username: string,
    password: string
  }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: {
    username: string;
    userId: string;
    token: string;
    expirationDate: Date;
    userRole: string
    redirect: boolean;
  }) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;
  constructor(public payload: {
    message: string,
    autoLogin: boolean,
    redirect: boolean
  }) {}
}

export class SignupFail implements Action {
  readonly type = SIGNUP_FAIL;
  constructor(public payload: string) {}    // error message
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    country: string,
    ssn: string
  }) {}
}

export type AuthActions = LoginStart
                        | LoginSuccess
                        | LoginFail
                        | Logout
                        | SignupStart
                        | AutoLogin
                        | SignupFail;
