import { User } from '../../shared/user.model';
import * as AuthActions from './auth.actions';

export interface State {
   user: User;
   authError: string;
}

const initiaState: State = {
   user: null,
   authError: null
}

export function authReducer(state: State = initiaState, action: AuthActions.AuthActions) {
    switch(action.type) {
        case AuthActions.LOGIN_START:
            return {
               ...state
            };
        case AuthActions.SIGNUP_START:
            return {
              ...state
            };
        case AuthActions.LOGIN_SUCCESS:
            const user = new User(
               action.payload.userId,
               action.payload.username,
               action.payload.token,
               action.payload.expirationDate,
               action.payload.userRole
            );
            return {
               ...state,
               user: user,
               authError: "Success login."
            };
        case AuthActions.LOGIN_FAIL:
          return {
            ...state,
            user: null,
            authError: action.payload.message
          };
        case AuthActions.LOGOUT:
           return {
              ...state,
              user: null,
              authError: "Success logout."
           };
        default:
           return state;
    }
}
