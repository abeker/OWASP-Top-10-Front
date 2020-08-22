import { Action } from '@ngrx/store';
import { Cart } from '../shared/cart.model';
import { AdResponse } from './../interfaces/adResponse.model';

export const ADD_TO_CART = '[Cart] Add an Ad in Cart';
export const CHANGE_DATE_TIME = '[Cart] Change Date&Time';
export const CHANGE_ADDRESS = '[Cart] Change Address';
export const CLEAR_CART = '[Cart] Clear Cart';
export const DELETE_AD_FROM_CART = '[Cart] Delete Ad From Cart';

export class AddToCart implements Action {
  readonly type = ADD_TO_CART;
  constructor(public payload: Cart) {}
}

export class ChangeDateTime implements Action {
  readonly type = CHANGE_DATE_TIME;
  constructor(public payload: {
    index: number
    id: string,
    dateFrom: string,
    dateTo: string,
    timeFrom: string,
    timeTo: string
  }) {}
}

export class ChangeAddress implements Action {
  readonly type = CHANGE_ADDRESS;
  constructor(public payload: {
    address: string,
    index: number
  }) {}
}

export class ClearCart implements Action {
  readonly type = CLEAR_CART;
}

export class DeleteAdFromCart implements Action {
  readonly type = DELETE_AD_FROM_CART;
  constructor(public payload: AdResponse) {}
}

export type CartActions = AddToCart
                        | ChangeDateTime
                        | ChangeAddress
                        | ClearCart
                        | DeleteAdFromCart;
