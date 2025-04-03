import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { PagerService } from '@shared/directives';
import { Router } from '@angular/router';
import { RmcostmasterService } from '@core/services/masters/rmcostmaster.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-costmastertrd-history',
  templateUrl: './costmastertrd-history.component.html',
  styleUrls: ['./costmastertrd-history.component.css']
})
export class CostmastertrdHistoryComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  historyList: any[] = [];
  // dateFormate: any;
  type: any = "costmastertrd";

  constructor(
    private pagerServcie: PagerService,
    private rmcostservice: RmcostmasterService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }
  private onLoad() {
    this.getHistoryCount(this.type);
    // this.dateFormate = 'dd/MM/yyyy hh:mm:ss';
  }

  public getHistoryCount(type) {
    let filtermodel = {};
    this.rmcostservice.getHistoryCount(type, filtermodel).subscribe(
      response => {
        this.totalRows = response.responsedata.count;
        if (this.totalRows > 0)
          this.getHisoryData();
        else
          this.historyList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getHisoryData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.rmcostservice.getHistoryList(this.type, filtermodel).subscribe(
      response => {
        this.historyList = response.importedHistoryList;
        this.historyList.forEach(element => {
          element.imported_on = Config.getDBdatetimeToDateTime(element.imported_on);
          // let date = element.imported_on.split('T')[0].split('-').reverse().join('/');
          // let time = element.imported_on.split('T')[1].substring(0, 8)
          // element.imported_on = date + ' ' + time;
        });
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public downloadFile(file: any, isStatus: boolean) {
    let url;
    if (isStatus)
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmastertrd/logs/' + file;
    else
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmastertrd/' + file;

    FileSaver.saveAs(url, file);
  }

  public cancelClicked() {
    this.router.navigateByUrl('masters/costmastertrd/list')
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
    this.getHisoryData();
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getHisoryData();
  }
}