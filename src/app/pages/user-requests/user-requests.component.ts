import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Request } from './../../interfaces/request.model';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  requestStatus: string;
  requestList: Request[];

  constructor(private route: ActivatedRoute,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(this.requestStatus !== params['requestStatus']) {
        this.sendRequest(params['requestStatus']);
      }
    });
  }

  sendRequest(requestStatus: string): void {
    let user = JSON.parse(localStorage.getItem("userData"));
    this.requestService.getUserRequests(user["id"], requestStatus).subscribe(requests => {
      this.requestList = requests;
    })
  }

  getTitle(request: Request): string {
    return request.ad.car.carModel.brandName + " " + request.ad.car.carModel.modelName;
  }

  payRequest(requestId: string): void {
    this.requestService.payRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    });
  }

  dropRequest(requestId: string): void {
    this.requestService.dropRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    })
  }

}
