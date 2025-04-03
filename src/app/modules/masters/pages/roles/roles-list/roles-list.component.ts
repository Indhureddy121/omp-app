import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/core/services/masters/roles.service';
import { FormBuilder } from '@angular/forms';
import { PagerService } from '@core/services/common/pager.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private pagerServcie: PagerService,
    private notificationService: NotificationService
  ) { }
  roleslist: any;
  itmPerPage: any;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = '';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  countmodel: {};
  searchModel = Object();

  ngOnInit() {
    this.getCount()
  }
  getCount() {
    this.rolesService.getCount(this.countmodel).subscribe(
      response => {
        this.totalRows = response.countrole;
        this.getData();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  private getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.rolesService.getRolesList(filtermodel).subscribe(
      response => {
        //console.log("Response",response);
        this.roleslist = response.userroles;
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        //console.log("Error",error);
        this.notificationService.showError(error.error.error.message);
      });
    // this.roleslist = [
    //   {role_code: 'TL', role_name:"Team Leader"},
    //   {role_code: 'SAP', role_name:"SAP"},
    //   {role_code: 'BL', role_name:"Business Leader"},
    //   {role_code: 'ASM', role_name:"ASM"},

    // ];
    this.itmPerPage = 10

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
      this.pageNumber = 1;
      this.countmodel = { "searchValue": response.searchValue };
    }
    this.getCount();
  }
  showEditIcon(rolesource: any) {
    //console.log("ROLE source",rolesource);
    if (rolesource == "Manual") {
      return true;
    } else {
      return false;
    }
  }
  onAddClick() {
    this.router.navigateByUrl('/masters/roles/add');
  }
  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';
    else
      this.sortDirection = 'DESC';
    var table = document.getElementById('table-role');
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
    this.router.navigate(['/masters/roles/view/' + id]);
  }
  onRefreshClick() {
    let filtermodel = {};
    this.rolesService.getSfdcUsers(filtermodel).subscribe(
      response => {
        //console.log("Response",response);
        this.getCount();
        this.notificationService.showSuccess(response.result);
        // this.usersList = response.ompusers;
        // this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        //console.log("Error",error);
        this.notificationService.showError(error.error.error.message);
      });
  }
}
