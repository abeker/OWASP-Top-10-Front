import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/app/services/ad.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { AdResponse } from './../../interfaces/adResponse.model';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css']
})
export class AdDetailsComponent implements OnInit {

  ad: AdResponse;
  array = [1, 2, 3, 4];

  constructor(private adService: AdService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
   this.store.select('ad').subscribe(adStore => {
     this.ad = adStore.selected_ad;
   });
  }

  visible = true;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

}
