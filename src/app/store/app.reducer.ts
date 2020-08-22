import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromCart from '../cart-store/cart.reducer';
import * as fromAd from '../ad-store/ad.reducer';

export interface AppState {
  auth: fromAuth.State;
  cart: fromCart.State;
  ad: fromAd.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  cart: fromCart.cartReducer,
  ad: fromAd.adReducer
};
