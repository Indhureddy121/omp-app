import { Component, OnInit } from '@angular/core';
import { OcactionService } from '@core/services/ocactioninterim/ocaction.service';
import { PagerService } from '@shared/directives';
import { AlertService } from '@core/services/common/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ocaction-list',
  templateUrl: './ocaction-list.component.html',
  styleUrls: ['./ocaction-list.component.css']
})
export class OcactionListComponent implements OnInit {
  userid: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRows: number;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  OcActionlist: any[] = [];
  pager: any = {};
  searchModel = Object();
  dateformate: string;
  dateFormate: string;

  constructor(
    private OCService: OcactionService,
    private pagerServcie: PagerService,
    private alertService: AlertService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.getCount(this.searchValue);
    this.dateFormate = this.authService.getDateFormat();
  }

  public getCount(searchValue) {
    this.OCService.getOCActionCount(searchValue).subscribe(
      response => {
        if (response) {
          this.totalRows = response.ocactioncount[0].total_count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.OcActionlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }


  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = {
      skip: skipdata,
      limit: pageSize,
      sortBy: this.sortDirection,
      searchValue: this.searchValue,
      sortField: this.sortField
    }

    this.OCService.getOcActionList(filtermodel).subscribe(
      response => {
        this.OcActionlist = response.ocactionlist;
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }



  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.pageNumber = 1;
    this.getCount(this.searchValue);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-ocaction');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData(this.pageSize);
  }


  viewClicked(id: number) {
    this.router.navigate(['/ocactioninterim/edit/' + id]);
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData(this.pageSize);
  }


}
