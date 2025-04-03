import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OmpusersService } from 'src/app/core/services/masters/ompusers.service';
import { FormBuilder } from '@angular/forms';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { RolesService } from '@core/services/masters/roles.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { Config } from 'src/app/core/configs/config';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageuserslistComponent implements OnInit {
  usersList: any;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = '';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  countmodel: {};
  searchModel = Object();
  userCardReport: any[] = [];
  createdDate: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ompusersService: OmpusersService,
    private pagerServcie: PagerService,
    private rolesService: RolesService,
    private appService: AppService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  userslist: any;
  itmPerPage: any;

  ngOnInit() {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.getCount();
    this.getAllUserData()
  }


  getAllUserData(){
    let filtermodel = { skip: 0, limit : 0 , sortBy: "", searchValue: "", sortField: "" }
    this.ompusersService.getUsersList(filtermodel).subscribe(
      response => {
        this.userCardReport = response.ompusers;
       
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  getCount() {
    var screenvalues = this.authService.getScreenValues().User;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;

    this.ompusersService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.countusers[0].usercount;
        if (this.totalRows > 0)
          this.getData();
        else
          this.usersList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.ompusersService.getUsersList(filtermodel).subscribe(
      response => {
        this.usersList = response.ompusers;
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

    this.itmPerPage = 10;
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    this.countmodel = {};
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }

    this.authService.setScreenValues('User', 'searchtext', this.searchValue);
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';
    else
      this.sortDirection = 'DESC';
    var table = document.getElementById('table-users');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onRowDoubleClick(id: number) {
    this.router.navigate(['/userprofile/users/view/' + id]);
  }

  onAddClick() {
    this.router.navigateByUrl('/userprofile/users/add');
  }

  onRefreshClick() {
    let filtermodel = {};
    this.ompusersService.getSfdcUsers(filtermodel).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess(response.result);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // showEditIcon(usersource: any) {
  //   if (usersource == "Manual") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  onUserEditClick(id: number) {
    this.router.navigate(['/userprofile/users/edit/' + id]);
  }

  onUserViewClick(id: number) {
    this.router.navigate(['/userprofile/users/view/' + id]);
  }

  onExport(){
    let userCardheader = Config.ReportsHeaders.userList;
    let fileName = 'User Report - ' + this.createdDate;
    this.userCardReport = this.userCardReport.map(item => {
      return {
        [userCardheader[0]]: item.userid,
        [userCardheader[1]]: item.fullname,
        [userCardheader[2]]: item.employee_sap_id,
        [userCardheader[3]]: item.role_code,
        [userCardheader[4]]: item.user_email,
        [userCardheader[5]]: item.user_mobile_no,
        [userCardheader[6]]: item.status,
        [userCardheader[7]]: item.onleave,
        
      };
    });

    this.appService.exportAsExcelFile(this.userCardReport, fileName);
  }
}
