import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AdService } from './../../services/ad.service';
import { AdResponse } from './../../interfaces/adResponse.model';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-ad-cards',
  templateUrl: './ad-cards.component.html',
  styleUrls: ['./ad-cards.component.css']
})
export class AdCardsComponent implements OnInit {

  adList: AdResponse[];
  adListOriginal: AdResponse[];
  @ViewChild('searchField') searchField: ElementRef;

  constructor(private adService: AdService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.adService.getAds().subscribe(listOfAds => {
      this.adList = listOfAds;
      this.adListOriginal = listOfAds;
    })
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

  addToCart(id): void {
    this.message.info('Added to cart. ['+id+']');
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
