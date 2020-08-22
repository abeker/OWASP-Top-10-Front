import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Request } from './../../interfaces/request.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { RatingService } from './../../services/rating.service';
import { AdResponse } from './../../interfaces/adResponse.model';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  requestStatus: string;
  requestList: Request[];
  userRating: string = '0';

  constructor(private route: ActivatedRoute,
              private requestService: RequestService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>,
              private ratingService: RatingService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(this.requestStatus !== params['requestStatus']) {
        this.sendRequest(params['requestStatus']);
      }
    });
  }

  sendRequest(requestStatus: string): void {
    let user = this.getUser();
    this.requestService.getUserRequests(user.id, requestStatus).subscribe(requests => {
      this.requestList = requests;
    })
  }

  getTitle(request: Request): string {
    return request.ad.car.carModel.brandName + " " + request.ad.car.carModel.modelName;
  }

  payRequest(requestId: string): void {
    this.message.success('Request successfully paid!');
    this.requestService.payRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    });
  }

  dropRequest(requestId: string): void {
    this.message.info('Request successfully dropped!');
    this.requestService.dropRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    })
  }

  confirmRating(ad: AdResponse): void {
    this.ratingService.rate(this.userRating, ad.id).subscribe(response => {
      this.message.info('ok');
    });
  }

  cancelRating(): void {
  }

  getUser(): any {
    let user = null;
    this.store.select('auth').subscribe(authData => {
      if(authData !== null) {
        user = authData.user;
      }
    });

    return user;
  }

}
