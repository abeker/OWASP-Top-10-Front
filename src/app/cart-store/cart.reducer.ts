import { Ad } from '../shared/ad.model';
import { Car } from '../shared/car.model';
import * as CartActions from './cart.actions';

export interface Cart {
  ad: Ad;
  car: Car;
}

export interface State {
  cartContent: Cart[];
}

const initiaState: State = {
  cartContent: []
}

export function cartReducer(state: State = initiaState, action: CartActions.CartActions) {
  switch(action.type) {
      case CartActions.ADD_TO_CART:
        let cart_content: Cart[];
        let ad_exist: boolean = false;
        state.cartContent.forEach(cart => {
           if(cart.ad.id === action.payload.ad.id) {
              ad_exist = true;
           }
        });
        if(!ad_exist) {
          cart_content = [...state.cartContent, action.payload];
        } else {
          cart_content = [...state.cartContent];
        }
        return {
           ...state,
           cartContent: cart_content
        };
      case CartActions.CHANGE_DATE_TIME:
        let updatedCart: Cart = {
          ...state.cartContent[action.payload.index]
        };
        let updatedAd: Ad = {
          ...updatedCart.ad
        }
        updatedAd.dateFrom = action.payload.dateFrom;
        updatedAd.dateTo = action.payload.dateTo;
        updatedAd.timeFrom = action.payload.timeFrom;
        updatedAd.timeTo = action.payload.timeTo;
        updatedCart.ad = updatedAd;
        const updatedCartList: Cart[] = [...state.cartContent];
        updatedCartList[action.payload.index] = updatedCart;
        return {
          ...state,
          cartContent: updatedCartList
        };
      case CartActions.CHANGE_ADDRESS:
        let updatedCartAddr: Cart = {
          ...state.cartContent[action.payload.index]
        };
        let updatedAdAddr: Ad = {
          ...updatedCartAddr.ad
        }
        updatedAdAddr.pickUpAddress = action.payload.address;
        updatedCartAddr.ad = updatedAdAddr;
        const updatedCartListAddr: Cart[] = [...state.cartContent];
        updatedCartListAddr[action.payload.index] = updatedCartAddr;
        return {
          ...state,
          cartContent: updatedCartListAddr
        };
      case CartActions.CLEAR_CART:
        let cleanCart: Cart[] = [];
        return {
          ...state,
          cartContent: cleanCart
        }
      case CartActions.DELETE_AD_FROM_CART:
        return {
          ...state,
          cartContent: state.cartContent.filter((cart, cart_index) => {
            return cart.ad.id !== action.payload.id;
          })
        }
      default:
        return state;
  }
}
