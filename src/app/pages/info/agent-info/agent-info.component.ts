import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/interfaces/dto/user-info.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-agent-info',
  templateUrl: './agent-info.component.html',
  styleUrls: ['./agent-info.component.css']
})
export class AgentInfoComponent implements OnInit {

  username: string = "";
  userInfo: UserInfo;

  constructor(private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.username = param.username;
    });

    this.userService.sendInfoRequest(this.username).subscribe(info => {
      this.userInfo = info;
    });
  }

}
