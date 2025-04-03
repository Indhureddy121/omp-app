import { Component, OnInit } from '@angular/core';
import { PagerService } from '@shared/directives';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { RatecontractService } from '@core/services/masters/ratecontract.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-ratecontracthistory',
  templateUrl: './ratecontracthistory.component.html',
  styleUrls: ['./ratecontracthistory.component.css']
})
export class RatecontracthistoryComponent implements OnInit {

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
  headerFields: any;
  type: string = 'rateContract';
  sampleData: any


  constructor(
    private pagerServcie: PagerService,
    private rateContractService: RatecontractService,
    private authService: AuthService,
    private appService: AppService,
    private router: Router,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }
  public onLoad() {


    this.getHistoryCount(this.type)
    this.dateFormate = this.authService.getDateFormat()


    this.headerFields = ['contract_code', 'client_code', 'item_code', 'contract_type', 'description', 'min_qty', 'price']

  }

  public getHistoryCount(type) {
    let filtermodel = {};
    this.rateContractService.getHistoryCount(type, filtermodel).subscribe(
      response => {
        this.totalRows = response.responsedata.count;
        this.getHisoryData();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  setPage(page: number) {
    this.pageNumber = page;
    this.getHisoryData();
  }
  public getHisoryData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.rateContractService.getHistoryList(this.type, filtermodel).subscribe(
      response => {
        this.historyList = response.importedHistoryList
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public downloadFile(file: any, isStatus: boolean) {
    // var isExist=this.headerFields.hasOwnProperty('Remarks')
    // if (isStatus && (!isExist)) {
    //   this.headerFields.push('Remarks')
    // }


    this.rateContractService.downloadFile(file, isStatus, this.type).subscribe(
      response => {
        this.fileData = response.fileData
        let filename = file.split('.')[0]
        this.fileData.forEach(element => {
          delete element.created_by
          delete element.created_date
          delete element.rowStatus

        });
        this.readAsCSV(this.fileData, filename)

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
  headerClick(event: any) {
    this.sortField = event.target.id;
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
  public cancelClicked() {
    this.router.navigateByUrl('masters/ratecontract/list')
  }

}

