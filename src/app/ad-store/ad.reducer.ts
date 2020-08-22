import { AdResponse } from './../interfaces/adResponse.model';
import * as AdActions from './ad.actions';

export interface State {
  selected_ad: AdResponse;
}

const initiaState: State = {
  selected_ad: null
}

export function adReducer(state: State = initiaState, action: AdActions.AdActions) {
  switch(action.type) {
      case AdActions.SELECT_AD:
        return {
          ...state,
          selected_ad: action.payload
        };
      default:
        return state;
  }
}
