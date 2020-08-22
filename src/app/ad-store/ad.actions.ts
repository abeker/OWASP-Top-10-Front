import { Action } from '@ngrx/store';
import { AdResponse } from './../interfaces/adResponse.model';

export const SELECT_AD = '[Ad] Select Ad';

export class SelectAd implements Action {
  readonly type = SELECT_AD;
  constructor(public payload: AdResponse) {}    // ad
}

export type AdActions = SelectAd;
