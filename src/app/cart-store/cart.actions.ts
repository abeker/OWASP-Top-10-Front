import { Action } from '@ngrx/store';
import { Cart } from '../shared/cart.model';

export const ADD_TO_CART = '[Cart] Add an Ad in Cart';
export const CHANGE_DATE_TIME = '[Cart] Change Date&Time';
export const CHANGE_ADDRESS = '[Cart] Change Address';
export const CLEAR_CART = '[Cart] Clear Cart';

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

export type CartActions = AddToCart
                        | ChangeDateTime
                        | ChangeAddress
                        | ClearCart;
