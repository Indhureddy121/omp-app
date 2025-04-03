import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@core/services/masters/customer.service';
import { Router } from '@angular/router';
import { PagerService } from '@shared/directives';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customer: any;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private pagerServcie: PagerService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  customerlist: any[] = [];
  itmPerPage: any;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  searchModel = Object();

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.getCount();
  }

  onRefreshClick() {
    let filtermodel = {};
    this.customerService.getSfdcCustomer(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.getCount();
          this.notificationService.showSuccess(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSAPRefreshClick() {
    this.customerService.getSAPCustomer().subscribe(
      response => {
        this.getCount();
        this.notificationService.showSuccess(response.result);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().Customer;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;

    let filtermodel = { searchValue: this.searchValue }
    this.customerService.getCount(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.totalRows = response.responsedata.data[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.customerlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);

    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.customerService.getCustomerList(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.customerlist = response.responsedata.data;
          this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
        }
      }, error => {
        this.notificationService.showError(error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.pageNumber = 1
    this.authService.setScreenValues('Customer', 'searchtext', this.searchValue);
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    this.pageNumber = 1
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';


    var table = document.getElementById('table-additionalcharges');
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
    this.router.navigate(['/customers/view/' + id]);
  }

  public getCustomer(id: number) {
    this.router.navigate(['/customers/view/', id]);
  }
}

