import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { OpportunitiesService } from '@core/services/opportunities/opportunities.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-opportunities-list',
  templateUrl: './opportunities-list.component.html',
  styleUrls: ['./opportunities-list.component.css']
})
export class OpportunitiesListComponent implements OnInit {

  opportunitylist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  userid: number;
  searchModel = Object();
  usertype: number = 0;

  constructor(
    private router: Router,
    private pagerService: PagerService,
    private authService: AuthService,
    private opportunitiesService: OpportunitiesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.onLoad();
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.getCount();
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().Opportunity;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;

    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.opportunitiesService.getCount(filtermodel).subscribe(
      response => {
        if (response.opportunities && response.opportunities.length > 0) {
          this.totalRows = response.opportunities[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.opportunitylist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.opportunitiesService.getopportunitylist(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.opportunitylist = response.responsedata.data;
          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
        } else {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    // this.getData();
    this.getCount();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.authService.setScreenValues('Opportunity', 'searchtext', this.searchValue);
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-opportunities');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    // this.getData();
    this.getCount();
  }

  onRowDoubleClick(id: string) {
    this.router.navigate(['/opportunities/view/' + id]);
  }

  onRefreshClick() {
    let filtermodel = {};
    this.opportunitiesService.getSfdcOpportunities(filtermodel).subscribe(
      response => {
        this.getCount();
        this.notificationService.showSuccess(response.result);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  viewClicked(id: string) {
    this.router.navigate(['/opportunities/view/' + id]);
  }

  createOfferClicked(opportunityid: number, opportunitytype: number, expiredate: Date) {
    if (new Date(expiredate) < new Date()) {
      this.notificationService.showError('Please update the opportunity close date in SFDC/OMP such that close date must be greater than or equal to today date.');
      return;
    }

    if (opportunitytype == 10 && this.usertype == 0)
      this.router.navigate(['/offers/add/' + opportunityid]);
    else if (opportunitytype == 20 && this.usertype >= 10)
      this.router.navigate(['/order/stockorder/add/' + opportunityid + '/' + opportunitytype]);
    else if (opportunitytype == 30 && this.usertype >= 10)
      this.router.navigate(['/order/cpoorder/add/' + opportunityid + '/' + opportunitytype]);
    else if (opportunitytype == 40) {
      this.notificationService.showWarning('Invalid account in this opportunity. Account should be dealer in this opportunity.');
      return;
    } else {
      this.notificationService.showWarning('You have no access to create offer/order.');
      return;
    }
  }

}
