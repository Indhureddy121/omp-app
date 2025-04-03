import { Component, OnInit, ViewChild } from '@angular/core';
import { MarginService } from '@core/services/masters/margin.service';
import { PagerService } from '@shared/directives';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SampleEnum } from '@core/enums/sample.enum';
import { StandarditemService } from 'src/app/core/services/masters/standarditem.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-margin-list',
  templateUrl: './margin-list.component.html',
  styleUrls: ['./margin-list.component.css']
})
export class MarginListComponent implements OnInit {

  MarginForm: FormGroup;
  importmodel: FormGroup;

  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  marginlist: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRows: number;
  pager: any = {};
  closeResult: string;
  fileData: any;
  fileUploaded: any;
  file: any;
  storeData: any;
  worksheet: XLSX.WorkSheet;
  jsonData: any[];
  importData: any[];
  importItemDetail: any[];
  type: string = 'marginmaster';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  deleteConfirmModel = Object();
  marginId: number;
  searchModel = Object();
  viewOnly: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private marginService: MarginService,
    private standarditemService: StandarditemService,
    private notificationService: NotificationService
  ) { }

  get marginForm() { return this.MarginForm.controls; }

  ngOnInit() {
    if (this.router.url.includes('view'))
      this.viewOnly = true;

    this.onLoad();
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onBuildForm();
    this.getCount();
  }

  public onBuildForm() {
    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.MarginForm = this.formBuilder.group({
      pg: [null, [Validators.required]],
      ph: [null, [Validators.required]],
      maxdiscount: [null, [Validators.required]],
      groupmargin: [null, [Validators.required]],
      industrystdtext: [null, [Validators.required]]
    });
  }

  public getCount() {
    this.marginService.getCount(this.searchValue).subscribe(
      response => {
        if (response) {
          this.totalRows = response.margin[0].count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.marginlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.marginService.getMarginList(filtermodel).subscribe(
      response => {
        this.marginlist = response.margin;
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData(this.pageSize);
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-margin');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData(this.pageSize);
  }

  public getLog() {
    this.router.navigateByUrl('masters/margin/logs');
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

  public onDismiss() {
    this.isShowDownload = false;
    this.modalService.dismissAll();
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.margin;
    FileSaver.saveAs(url, SampleEnum.margin);
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
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  onSave() {
    if (this.readAsJson()) {
      if (this.validateFileData()) {
        this.uploadFile(this.file);
      }
    }
  }

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: true, defval: null });
    this.importData = this.jsonData;
    let data = []
    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.marginmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.marginmaster)) {
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

  uploadFile(file: any) {
    this.standarditemService.upload(file, this.type).subscribe(
      response => {
        this.filename = response;
        this.saveData(this.filename);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public exportfiles(file: any) {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/marginmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    this.marginService.importmargin(fileresponse).subscribe(
      response => {
        if (response) {
          this.savedResult = response.result;
          this.isShowDownload = true;
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/marginmaster/logs/' + this.savedResult.status_file_name;
          FileSaver.saveAs(url, this.savedResult.status_file_name);
          this.notificationService.showSuccess("Imported Successfully");
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public onExport() {
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.marginService.getMarginList(filtermodel).subscribe(
      response => {
        this.exportdatalist = response.margin;
        let listData = []
        if (this.exportdatalist) {
          listData = this.exportdatalist;
        }

        listData.forEach(element => {
          delete element.id;
          delete element.lastupdated_by;
          delete element.lastupdated_date;
        });

        let marginmasterheader = Config.masterfilesheaders.marginmaster;
        listData = listData.map(item => {
          return {
            [marginmasterheader[0]]: item.pg,
            [marginmasterheader[1]]: item.ph,
            [marginmasterheader[2]]: item.maxdiscount,
            [marginmasterheader[3]]: item.gm,
            [marginmasterheader[4]]: item.industrystdtext
          };
        });

        let fileName = 'Margin - ' + this.createdDate;
        this.appService.exportAsExcelFile(listData, fileName);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onMarginDelete(event) {
    this.marginService.deletemargin(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess('Margin deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditMarginPopup(id: number) {
    if (id) {
      this.marginService.getMarginData(id).subscribe(
        response => {
          if (response.data) {
            this.marginId = response.data[0].id;
            this.marginForm.pg.setValue(response.data[0].pg);
            this.marginForm.ph.setValue(response.data[0].ph);
            this.marginForm.maxdiscount.setValue(response.data[0].maxdiscount);
            this.marginForm.groupmargin.setValue(response.data[0].gm);
            this.marginForm.industrystdtext.setValue(response.data[0].industrystdtext);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.marginId = null;
      this.marginForm.pg.setValue(null);
      this.marginForm.ph.setValue(null);
      this.marginForm.maxdiscount.setValue(null);
      this.marginForm.groupmargin.setValue(null);
      this.marginForm.industrystdtext.setValue(null);
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'md', backdrop: 'static' });
  }

  onMarginSaveClick() {
    this.submitted = true;

    if (this.MarginForm.invalid)
      return;

    if (Number(this.marginForm.maxdiscount.value) > 0.99 || Number(this.marginForm.groupmargin.value) > 0.99)
      return;

    let marginmasterheader = Config.masterfilesheaders.marginmaster;
    let marginsavemodel = [{
      [marginmasterheader[0]]: this.marginForm.pg.value,
      [marginmasterheader[1]]: this.marginForm.ph.value,
      [marginmasterheader[2]]: this.marginForm.maxdiscount.value,
      [marginmasterheader[3]]: this.marginForm.groupmargin.value,
      [marginmasterheader[4]]: this.marginForm.industrystdtext.value
    }]

    this.marginService.savemargin(marginsavemodel).subscribe(
      response => {
        this.getCount();
        this.notificationService.showSuccess('Margin saved successfully. It will take 20 minutes to reflect in offer.');
        this.modalService.dismissAll();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}