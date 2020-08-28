import { Component, OnInit } from '@angular/core';
import { RequestService } from './../../services/request.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Request } from './../../interfaces/request.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-agent-requests',
  templateUrl: './agent-requests.component.html',
  styleUrls: ['./agent-requests.component.css']
})
export class AgentRequestsComponent implements OnInit {

  requestStatus: string = "";
  requestList: Request[];

  constructor(private route: ActivatedRoute,
              private requestService: RequestService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(this.requestStatus !== params['requestStatus']) {
        this.sendRequest(params['requestStatus']);
      }
      this.requestStatus = params['requestStatus'];
    });
  }

  sendRequest(requestStatus: string): void {
    let user = this.getUser();
    this.requestService.getAgentRequests(user.id, requestStatus).subscribe(requests => {
      this.requestList = requests;
    })
  }

  getTitle(request: Request): string {
    return request.ad.car.carModel.brandName + " " + request.ad.car.carModel.modelName;
  }

  approveRequest(requestId: string): void {
    this.requestService.approveRequest(requestId).subscribe(requests => {
      this.message.success('Request successfully approved!');
      this.requestList = requests;
    }, error => {
      this.message.error('Something went wrong!');
    });
  }

  denyRequest(requestId: string): void {
    this.requestService.denyRequest(requestId).subscribe(requests => {
      this.message.info('Request successfully denied!');
      this.requestList = requests;
    }, error => {
      this.message.error('Something went wrong!');
    })
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
