import { Component, OnInit } from '@angular/core';
import { PagerService } from '@shared/directives';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-alpmaster-history',
  templateUrl: './alpmaster-history.component.html',
  styleUrls: ['./alpmaster-history.component.css']
})
export class AlpmasterHistoryComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  historyList: any[] = [];
  // dateFormate: any;
  type: string = 'alpmaster';

  constructor(
    private pagerServcie: PagerService,
    private standarditemService: StandarditemService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.getHistoryCount(this.type)
    // this.dateFormate = 'dd/MM/yyyy hh:mm:ss';
  }

  getHistoryCount(type) {
    let filtermodel = {};
    this.standarditemService.getHistoryCount(type, filtermodel).subscribe(
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

  setPage(page: number) {
    this.pageNumber = page;
    this.getHisoryData();
  }

  getHisoryData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.standarditemService.getHistoryList(this.type, filtermodel).subscribe(
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

  downloadFile(file: any, isStatus: boolean) {
    let url;
    if (isStatus)
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/alpmaster/logs/' + file;
    else
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/alpmaster/' + file;

    FileSaver.saveAs(url, file);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-alpmaster');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getHisoryData();
  }

  public cancelClicked() {
    this.router.navigateByUrl('masters/alpmaster/list')
  }
}