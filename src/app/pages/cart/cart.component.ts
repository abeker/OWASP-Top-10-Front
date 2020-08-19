import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { differenceInCalendarDays } from 'date-fns';
import { NzButtonSize, NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { Ad } from 'src/app/shared/ad.model';
import { Cart } from 'src/app/shared/cart.model';
import * as CartActions from '../../cart-store/cart.actions';
import * as fromApp from '../../store/app.reducer';
import { RequestService } from './../../services/request.service';

export interface RequestDTO {
  adID: string;
  customerID: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  returnTime: string;
  pickUpAddress: string;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cartContent: Cart[];
  subscription: Subscription;
  size: NzButtonSize = 'large';
  dateFrom: Date;
  dateTo: Date;
  dates: Object;

  constructor(private store: Store<fromApp.AppState>,
              private message: NzMessageService,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.subscription = this.store.select('cart').subscribe(cartItems => {
      this.cartContent = cartItems.cartContent;
    });
  }

  onChangeDate(result: Date, adID?: string): void {
    this.dateFrom = new Date(result[0]);
    this.dateTo = new Date(result[1]);
    this.formatDatesCorrectly(this.dateFrom.toISOString(),this.dateTo.toISOString());
    const timeFrom:string = this.dates["from"].split(" ")[0];
    const timeTo:string = this.dates["to"].split(" ")[0];
    const dateFrom:string =this.dates["from"].split(" ")[1];
    const dateTo:string = this.dates["to"].split(" ")[1];
    // console.log(timeFrom + "-" +timeTo + ", " +dateFrom + "-" +dateTo);
    let index: number;
    this.store.select('cart').subscribe(content => {
      index = content.cartContent.findIndex(x => x.ad.id === adID);
    });

    this.store.dispatch(new CartActions.ChangeDateTime({
      id: adID,
      dateFrom: dateFrom,
      dateTo: dateTo,
      timeFrom: timeFrom,
      timeTo: timeTo,
      index: index
    }));

    this.message.info("Pick Up Time: " + dateFrom + " at " + timeFrom +
                ", Return time: " + dateTo + " at " + timeTo);
  }

  formatDatesCorrectly(date1 : string, date2 : string) : void {
    let timeFrom = date1.split('T')[1].substring(0,5);
    let timeTo = date2.split('T')[1].substring(0,5);
    let dateFrom = date1.split('T')[0];
    let dateTo = date2.split('T')[0];
    this.dates = {
      from : timeFrom + " " + dateFrom,
      to : timeTo + " " + dateTo,
    }
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(new Date(), current) > 0;
  };

  sendRequest(): void {
    let requestBody: RequestDTO[] = [];
    let customerID: string;
    let isOk: boolean[] = [];
    this.store.select('auth').subscribe(authData => {
      customerID = authData.user.id;
    });

    this.store.select('cart').subscribe(cart => {
      cart.cartContent.forEach(cart => {
        let requestDTO: RequestDTO;
        if(this.checkInputFields(cart)) {
          const ad: Ad = {...cart.ad};
          requestDTO = {
            adID: ad.id,
            customerID: customerID,
            pickUpDate: ad.dateFrom,
            pickUpTime: ad.timeFrom,
            returnDate: ad.dateTo,
            returnTime: ad.timeTo,
            pickUpAddress: ad.pickUpAddress,
          }

          requestBody.push(requestDTO);
          isOk.push(true);
        } else {
          isOk.push(false);
        }
      });

      if(isOk.indexOf(false) === -1) {
        console.log(requestBody);
         this.requestService.sendRequest(requestBody).subscribe(() => {
          this.message.success('Request is successfully created.');
          this.store.dispatch(new CartActions.ClearCart());
         }, error => {
            this.message.error('Request is not created.');
         })
      } else {
        this.message.warning('Please fill all input fields.');
      }
    });
  }

  checkInputFields(cart: Cart): boolean {
    if(!cart.ad.dateFrom || !cart.ad.dateTo || !cart.ad.timeFrom || !cart.ad.timeTo) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
