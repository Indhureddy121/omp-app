import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MoqService } from '@core/services/masters/moq.service';
import { NotificationService } from '@core/services/common/notification.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { Config } from '@core/configs/config';
import { PagerService } from '@shared/directives';
import { environment } from 'src/environments/environment';
import { SampleEnum } from '@core/enums/sample.enum';

@Component({
  selector: 'app-moq',
  templateUrl: './moq.component.html',
  styleUrls: ['./moq.component.css']
})
export class MoqComponent implements OnInit {

  exportMFG: boolean = false;
  exportTRD: boolean = false;
  ExportItemsForm: FormGroup;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  export_type: any;
  exportdatalist: any[] = [];
  isShowDownload: boolean = false;
  closeResult: string;
  importmodel: FormGroup;
  type: string = 'moqmaster';
  filename: string;
  file: any;
  worksheet: XLSX.WorkSheet;
  jsonData: any[];
  importData: any[];
  headerList: string[];
  fileUploaded: any;
  storeData: any;
  historyList: any[] = [];
  totalRows: number;
  totalSTD: number;
  totalTRD: number;
  pageSize = 10;
  pageNumber = 1;
  pager: any = {};
  filetype: string = 'moq';
  isLoading = false;
  viewOnly: boolean = false;

  @ViewChild('ExportOptiontemModal', { static: false }) ExportOptiontemModal: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private MOQService: MoqService,
    private notificationService: NotificationService,
    private standarditemService: StandarditemService,
    private pagerServcie: PagerService,
  ) {

    this.ExportItemsForm = this.formBuilder.group({
      exportoption: [null]
    });

    this.importmodel = this.formBuilder.group({
      importoption: ['', Validators.required],
      importFile: [null, Validators.required],
    });

  }

  get exportItemsForm() { return this.ExportItemsForm.controls }

  ngOnInit() {
    this.onLoad();
    this.viewOnly = true;
  }

  private onLoad() {
    this.getHistoryCount(this.filetype);
  }

  getHistoryCount(filetype) {
    let filtermodel = {};
    this.standarditemService.getHistoryCount(filetype, filtermodel).subscribe(
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

  getHisoryData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.standarditemService.getHistoryList(this.filetype, filtermodel).subscribe(
      response => {
        this.historyList = response.importedHistoryList;
        this.historyList.forEach(element => {
          element.imported_on = Config.getDBdatetimeToDateTime(element.imported_on);
        });
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }





  isInvalid(controlName: string): boolean {
    const control = this.importmodel.get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  public onExport() {

    this.exportMFG = false;
    this.exportTRD = false;

    this.modalService.open(this.ExportOptiontemModal, { size: 'md', backdrop: 'static' });
  }

  onExportOptionChange(event: any) {
    if (event.target.value == '0') {
      this.exportMFG = true;
      this.exportTRD = false;
    } else {
      this.exportMFG = false;
      this.exportTRD = true;
    }
  }


  onExportClick() {

    if (this.exportMFG) {
      this.export_type = "MFG"
      this.onExportList();
    } else if (this.exportTRD) {
      this.export_type = "TRD"
      this.onExportList();
    }
  }


  onExportList() {
    let filtermodel = {
      skip: 0,
      limit: 0,
      sortBy: this.sortDirection,
      searchValue: this.searchValue,
      sortField: this.sortField,
      export_type: this.export_type
    };

    this.MOQService.getMoqList(filtermodel).subscribe(
      response => {
        this.exportdatalist = response.responsedata;

        if (this.exportMFG || this.exportTRD) {
          const exportType = this.exportMFG ? 'MFG_Data' : 'TRD_Data';

          const exportData = this.exportdatalist.map(item => ({
            'ARTICLE NO': item.articleno,
            'MOQ': item.moq,
            'MDQ': item.mdq,
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

          const currentDate = new Date();
          const dateString = currentDate.toISOString().slice(0, 10);
          const fileName = `${exportType}_${dateString}.xlsx`;
          this.saveAsExcelFile(excelBuffer, fileName);
        }

      }, error => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, fileName);
    this.modalService.dismissAll();
  }

  public open(content) {
    this.isShowDownload = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  uploadFile(file: any) {
    this.standarditemService.upload(file, this.type).subscribe(
      response => {
        this.filename = response;
        // this.saveData(this.filename.toString());
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }




  onSave() {

    if (this.importmodel.invalid) {
      this.notificationService.showError('Please Select Import Option');
    }

    if (this.importmodel.valid) {
      const formValue = this.importmodel.value;
      if (this.readAsJson()) {
        if (this.validateFileData()) {
          this.standarditemService.upload(this.file, this.type).subscribe(
            response => {
              this.filename = response;
              formValue.filename = this.filename;
              this.MOQService.importMoq(formValue).subscribe(
                response => {
                  this.modalService.dismissAll();
                  this.notificationService.showSuccess("Imported successfully.");
                  this.onLoad();
                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }, error => {
              this.notificationService.showError(error.error.error.message);
            });
        }
      }
    }

  }

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: true, defval: null });
    this.importData = this.jsonData;
    let data = []
    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.Moqitem.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.Moqitem)) {
      this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
      return false;
    } else
      return true;
  }

  public validateFileData() {
    if (this.importData == undefined) {
      this.notificationService.showError('File contains some invalid data.');
      return;
    } else if (this.importData != undefined) {
      if (this.importData.length <= 0) {
        this.notificationService.showError('File contains no data.');
        return;
      }
    }

    return true;
  }


  uploadedFile(event) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = event.target.files[0].name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.notificationService.showError("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    }
    else {
      this.fileUploaded = event.target.files[0];
      this.file = event.target.files[0];
      this.showLoader();
      this.readExcel();
    }
  }

  private readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      this.hideLoader(); 
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getHisoryData();
  }


  downloadFile(file: any, isStatus: boolean, type: string) {
    let url;
    if (isStatus)

      if (type == 'costmasterstd_moq')
        url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmasterstd_moq/logs/' + file;
      else {
        url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmasterstd_moq/logs/' + file;
      }
    else
      url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/moqmaster/' + file;

    FileSaver.saveAs(url, file);
  }



  sortData(data: any[], sortBy: string, sortDirection: string): any[] {
    return data.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (valueA < valueB) {
        return sortDirection === 'ASC' ? -1 : 1;
      } else if (valueA > valueB) {
        return sortDirection === 'ASC' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.MOqitem;
    FileSaver.saveAs(url, SampleEnum.MOqitem);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-productmaster');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getHisoryData();
  }



  private showLoader() {
    this.isLoading = true;
  }

  private hideLoader() {
    this.isLoading = false;
  }

  public onDismiss() {
    this.modalService.dismissAll();
  }


























}
