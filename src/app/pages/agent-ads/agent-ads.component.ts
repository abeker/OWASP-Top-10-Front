import { Component, OnInit } from '@angular/core';
import { AdResponse } from './../../interfaces/adResponse.model';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agent-ads',
  templateUrl: './agent-ads.component.html',
  styleUrls: ['./agent-ads.component.css']
})
export class AgentAdsComponent implements OnInit {

  adList: AdResponse[];

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.agentService.getAgentAds('randomUUID').subscribe(agentAds => {
      this.adList = agentAds;
    })
  }

  getTitle(ad: AdResponse): string {
    return ad.car.carModel.brandName + " " + ad.car.carModel.modelName;
  }

}
