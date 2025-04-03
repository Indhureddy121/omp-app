import { Component, OnInit } from '@angular/core';
import { PagerService } from '@shared/directives';
import { AlertService } from '@core/services/common/alert.service';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { Config } from '@core/configs/config';

@Component({
  selector: 'app-petscreen-history',
  templateUrl: './petscreen-history.component.html',
  styleUrls: ['./petscreen-history.component.scss']
})
export class PetscreenHistoryComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  historyList: any[] = [];
  // dateFormate: any;
  type: string = 'petmaster';

  constructor(
    private pagerServcie: PagerService,
    private alertService: AlertService,
    private standarditemService: StandarditemService,
    private router: Router
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
        this.alertService.showError(error.error.error.message);
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
        });
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  downloadFile(file: any, isStatus: boolean) {
    let url;
    if (isStatus)
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/petmaster/logs/' + file;
    else
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/petmaster/' + file;

    FileSaver.saveAs(url, file);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-petmaster');
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
    this.router.navigateByUrl('/petscreen/list')
  }
}
