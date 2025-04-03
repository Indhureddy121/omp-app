import { Component, OnInit } from '@angular/core';
import { PagerService } from '@shared/directives';
import { DownloadmasterService } from '@core/services/masters/downloadmaster.service';
import { CostmastertrdService } from '@core/services/masters/costmastertrd.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { DownloadTypeEnum } from '@core/enums/downloadtype.enum';
import { DownloadStatusEnum } from '@core/enums/downloadstatus.enum';

@Component({
  selector: 'app-costmastertrd-downloads',
  templateUrl: './costmastertrd-downloads.component.html',
  styleUrls: ['./costmastertrd-downloads.component.css']
})
export class CostmastertrdDownloadsComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  downloadList: any[] = [];
  type: number = DownloadTypeEnum.costmastertrd;
  serverPath: string = '';

  constructor(
    private pagerServcie: PagerService,
    private notificationService: NotificationService,
    private downloadmasterService: DownloadmasterService,
    private costmastertrdService: CostmastertrdService,
    private authService: AuthService,
    private router: Router
  ) {
    this.serverPath = environment.apiUrl.substring(0, environment.apiUrl.length - 7);
  }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.getDownloadCount(this.type);
  }

  getDownloadCount(type) {
    let filtermodel = { downloadtype: type }
    this.downloadmasterService.getDownloadCount(filtermodel).subscribe(
      response => {
        this.totalRows = response.responsedata.data[0].count;
        if (this.totalRows > 0)
          this.getDownloadData();
        else
          this.downloadList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getDownloadData();
  }

  getDownloadData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.downloadmasterService.getDownloadMasterList(this.type, filtermodel).subscribe(
      response => {
        this.downloadList = response.downloadMasterList;
        this.downloadList.forEach(element => {
          element.created_at = Config.getDBdatetimeToDateTime(element.created_at);
          if (element.comments)
            element.newcomments = JSON.parse(element.comments).filters.search;
          else
            element.newcomments = "";
        });
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  downloadFile(file: any, isStatus: boolean) {
    let url;
    url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/downloads/costmastertrd/' + file;
    FileSaver.saveAs(url, file);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-costmastertrd');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getDownloadData();
  }

  public cancelClicked() {
    this.router.navigateByUrl('masters/costmastertrd/list')
  }

  public restartExportFile(fileObj: any) {
    let filtermodelexport = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: fileObj.comments, sortField: this.sortField, userId: this.authService.getUserId(), fileName: "", downloadId: 0 }
    this.costmastertrdService.initiateExportCostMaster(filtermodelexport).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.getDownloadData();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public sendNameByStatusID(status: number) {
    let downloadStatus;
    if (status == 10)
      downloadStatus = DownloadStatusEnum.ten;
    else if (status == 20)
      downloadStatus = DownloadStatusEnum.twenty;
    else if (status == 30)
      downloadStatus = DownloadStatusEnum.thirty;
    else if (status == 40)
      downloadStatus = DownloadStatusEnum.forty;
    else if (status == 50)
      downloadStatus = DownloadStatusEnum.fifty;
    return downloadStatus;
  }

  onRefreshClick() {
    this.getDownloadCount(this.type);
  }

  getDownloadFileLink(fileName: string) {
    return this.serverPath + 'uploads/downloads/costmastertrd/' + fileName;
  }
}
