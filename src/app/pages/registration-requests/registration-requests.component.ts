import { Component, OnInit } from '@angular/core';
import { SimpleUserService } from './../../services/simple-user.service';
import { AdminService } from './../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd';

interface DataItem {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  userRole: string;
}

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css']
})
export class RegistrationRequestsComponent implements OnInit {

  constructor(private simpleUserService: SimpleUserService,
              private adminService: AdminService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.simpleUserService.getAllRegistrationRequestsByStatus('PENDING').subscribe(simpleUsersList => {
      this.listOfData = simpleUsersList;
      this.listOfDisplayData = [...this.listOfData];
    });
  }

  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [];
  listOfDisplayData = [...this.listOfData];

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.username.indexOf(this.searchValue) !== -1);
  }

  approveRequest(id): void {
    this.adminService.approveRegistrationRequest(id).subscribe(simpleUsersList => {
      this.listOfData = simpleUsersList;
      this.listOfDisplayData = [...this.listOfData];
      this.message.info('Registration request is successfully approved.');
    });
  }

  denyRequest(id): void {
    this.adminService.danyRegistrationRequest(id).subscribe(simpleUsersList => {
      this.listOfData = simpleUsersList;
      this.listOfDisplayData = [...this.listOfData];
      this.message.info('Registration request is successfully denied.');
    });
  }

}
