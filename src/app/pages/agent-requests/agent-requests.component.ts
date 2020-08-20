import { Component, OnInit } from '@angular/core';
import { RequestService } from './../../services/request.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Request } from './../../interfaces/request.model';

@Component({
  selector: 'app-agent-requests',
  templateUrl: './agent-requests.component.html',
  styleUrls: ['./agent-requests.component.css']
})
export class AgentRequestsComponent implements OnInit {

  requestStatus: string = "";
  requestList: Request[];

  constructor(private route: ActivatedRoute,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(this.requestStatus !== params['requestStatus']) {
        this.sendRequest(params['requestStatus']);
      }
      this.requestStatus = params['requestStatus'];
    });
  }

  sendRequest(requestStatus: string): void {
    let user = JSON.parse(localStorage.getItem("userData"));
    this.requestService.getAgentRequests(user["id"], requestStatus).subscribe(requests => {
      this.requestList = requests;
    })
  }

  getTitle(request: Request): string {
    return request.ad.car.carModel.brandName + " " + request.ad.car.carModel.modelName;
  }

  approveRequest(requestId: string): void {
    this.requestService.approveRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    });
  }

  denyRequest(requestId: string): void {
    this.requestService.denyRequest(requestId).subscribe(requests => {
      this.requestList = requests;
    })
  }

}
