import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd';
import { Ad } from 'src/app/shared/ad.model';
import { Car } from 'src/app/shared/car.model';
import * as CartActions from '../../cart-store/cart.actions';
import * as fromApp from '../../store/app.reducer';
import { AdResponse } from './../../interfaces/adResponse.model';
import { AdService } from './../../services/ad.service';
import { CartService } from './../../services/cart.service';

@Component({
  selector: 'app-ad-cards',
  templateUrl: './ad-cards.component.html',
  styleUrls: ['./ad-cards.component.css']
})
export class AdCardsComponent implements OnInit {

  adList: AdResponse[];
  adListOriginal: AdResponse[];
  @ViewChild('searchField') searchField: ElementRef;
  retrievedImage: any;
  retrievedImages: string[] = [];
  base64Data: any;

  constructor(private adService: AdService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.adService.getAds().subscribe(listOfAds => {
      this.adList = listOfAds;
      this.adList.forEach(ad => {
        if(ad.photos.length != 0) {
          ad.photos.forEach(photo => {
            photo.picByte = "data:image/jpeg;base64," + photo.picByte;
          });
        }
      });
      this.adListOriginal = listOfAds;
    });
  }

  getTitle(ad: AdResponse): string {
    return ad.car.carModel.brandName + " " + ad.car.carModel.modelName;
  }

  getDescription(ad:AdResponse): string {
    return "Model from class " + ad.car.carModel.className + " and fuel type " + ad.car.fuelType
      + ". Gearshift type is " + ad.car.gearshiftType + " with " + ad.car.numberOfGears + " gears."
      + ". Car was already travelled " + ad.car.kilometersTravelled + "km, and owns " + ad.seats
      + (ad.seats > 1 ? " seats for kids." : " seat for kid.");
  }

  addToCart(ad: AdResponse): void {
    this.message.info('Added to cart ['+ ad.car.carModel.brandName + ' ' + ad.car.carModel.modelName +']');
    const car: Car = {
      id: ad.car.id,
      model: ad.car.carModel.modelName,
      brand: ad.car.carModel.brandName,
      carClass: ad.car.carModel.className,
      fuelType: ad.car.fuelType,
      gearshiftType: ad.car.gearshiftType,
      gearshiftNumberOfGears: ad.car.numberOfGears
    };

    const adModel: Ad = {
      id: ad.id,
      photos: ad.photos,
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
      pickUpAddress: ad.agent.address
    };
    let userRole: any;
    this.store.select('auth').subscribe(authData => {
      if(authData !== null) {
        userRole = authData.user.userRole;
      }
    });
    if(userRole === "SIMPLE_USER") {
      this.cartService.cartChanged.next(true);
      this.store.dispatch(new CartActions.AddToCart({
        car: car,
        ad: adModel
      }));
    }
  }

  info(id): void {
    this.message.info('Info. ['+id+']');
  }

  search(): void {
    let searchValue: string = this.searchField.nativeElement.value;
    let searchingResult: AdResponse[] = [];
    this.adListOriginal.forEach(ad => {
      let carBrandModel: string = ad.car.carModel.brandName + " " + ad.car.carModel.modelName;
      if(carBrandModel.toLowerCase().includes(searchValue.toLowerCase())) {
        searchingResult.push(ad);
      }
    });

    this.adList = [...searchingResult];
  }

  reloadSearch(): void {
    this.adList = [...this.adListOriginal];
  }

}
