import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromCart from '../cart-store/cart.reducer';

export interface AppState {
  auth: fromAuth.State;
  cart: fromCart.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  cart: fromCart.cartReducer
};
