import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserInfo } from './../../../interfaces/dto/user-info.model';

@Component({
  selector: 'app-admin-info',
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.css']
})
export class AdminInfoComponent implements OnInit {

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
