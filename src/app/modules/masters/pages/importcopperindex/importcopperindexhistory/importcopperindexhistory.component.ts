import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { ImportCopperIndexService } from '@core/services/masters/import-copper-index.service';
import { PagerService } from '@shared/directives';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-importcopperindexhistory',
  templateUrl: './importcopperindexhistory.component.html',
  styleUrls: ['./importcopperindexhistory.component.css']
})
export class ImportcopperindexhistoryComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  historyList: any[] = [];
  dateFormate: any;
  fileData: any;
  headerFields: any
  type: any = "CopperIndex";
  worksheet: XLSX.WorkSheet;
  constructor(
    private pagerServcie: PagerService,
    private importCopperIndexService: ImportCopperIndexService,
    private authService: AuthService,
    private appService: AppService,
    private router: Router,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }
  private onLoad() {
    this.getHistoryCount(this.type)
    this.headerFields = ['Material_No', 'Description', 'Copper_Index']
    this.dateFormate = this.authService.getDateFormat()

  }

  public getHistoryCount(type) {
    let filtermodel = {};
    this.importCopperIndexService.getHistoryCount(type, filtermodel).subscribe(
      response => {
        this.totalRows = response.responsedata.count;
        this.getHisoryData();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getHisoryData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.importCopperIndexService.getHistoryList(this.type, filtermodel).subscribe(
      response => {
        this.historyList = response.importedHistoryList
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  readAsCSV(sheetData, filename) {

    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(sheetData);
    var csvData = XLSX.utils.sheet_to_csv(workSheet);
    const data: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, filename + new Date().getTime() + '.csv');
  }
  public downloadFile(file: any, isStatus: boolean) {
    if (isStatus) {
      this.headerFields.push('Remarks')
    }

    this.importCopperIndexService.downloadFile(file, isStatus, this.type).subscribe(
      response => {
        this.fileData = response.fileData
        let filename = file.split('.')[0]
        this.readAsCSV(this.fileData, filename)


        // let link = this.appService.downloadFile(this.fileData, filename, this.headerFields)
        // link.click()
        // document.body.removeChild(link);
        this.headerFields.pop()
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public cancelClicked() {
    this.router.navigateByUrl('masters/importcopperindex/list')
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
