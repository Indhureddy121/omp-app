import { Component, OnInit, ViewChild } from '@angular/core';
import { PagerService } from '@shared/directives';
import { RmcostmasterService } from '@core/services/masters/rmcostmaster.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FreightfactorService } from '@core/services/masters/freightfactor.service';
import * as moment from 'moment';
import { StatusData } from '@module/masters/CSV';
import { SampleEnum } from '@core/enums/sample.enum';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-importfreightfactor',
  templateUrl: './importfreightfactor.component.html',
  styleUrls: ['./importfreightfactor.component.css']
})
export class ImportfreightfactorComponent implements OnInit {

  importmodel: FormGroup;
  FreightMasterForm: FormGroup;

  isShowDownload: boolean;
  closeResult: string;
  statusData: any[];
  linkDisable: boolean = true;
  csvRecord: any;
  csvRecords: any[];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'ASC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  importData: any;
  headerList: string[];
  currentUser: any;
  freightmasterList: any[] = [];
  StandardItemDetail: any;
  filename: any;
  file: any;
  dateformatdata: any;
  type = 'freightmaster'
  sampleData: any
  fileUploaded: any;
  storeData: any;
  worksheet: XLSX.WorkSheet;
  jsonData: unknown[];
  createdDate: any;
  fileData: any;
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  freightmasterId: number;
  viewOnly: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private rmcostmasterservice: RmcostmasterService,
    private freightfactorService: FreightfactorService,
    private appService: AppService,
    private standarditemService: StandarditemService,
    private notificationService: NotificationService
  ) { }

  get freightMasterForm() { return this.FreightMasterForm.controls }

  ngOnInit() {
    if (this.router.url.includes('view'))
      this.viewOnly = true;

    this.onLoad();
  }

  public onLoad() {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onBuildForm();
    this.getCount(this.searchValue);
  }

  public onBuildForm() {
    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.FreightMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      owf: [null],
      adjfactorone: [null],
      adjfactortwo: [null],
      adjfactorthree: [null],
      adjfactorfour: [null],
      adjfactorfive: [null],
      adjfactorsix: [null]
    });
  }

  public getCount(searchValue) {
    this.freightfactorService.getCount(searchValue).subscribe(
      response => {
        this.totalRows = response.freightfactor[0].count;
        if (this.totalRows > 0)
          this.getData(this.pageSize);
        else
          this.freightmasterList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.freightfactorService.freightfactorlist(filtermodel).subscribe(
      response => {
        this.freightmasterList = response.fflist;
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
    this.getCount(this.searchValue);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-freightfactor');
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
    this.router.navigateByUrl('masters/freightfactormaster/logs');
  }

  public open(content) {
    this.isShowDownload = false;
    this.importData = [];
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

  public onSave() {
    if (this.readAsJson()) {
      if (this.validateFileData()) {
        this.uploadFile(this.file);
      }
    }
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

  public onExport() {
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.freightfactorService.freightfactorlist(filtermodel).subscribe(
      response => {
        this.exportdatalist = response.fflist;
        let listData = [];

        if (this.exportdatalist) {
          listData = this.exportdatalist;

          listData.forEach(element => {
            delete element.id;
            delete element.fm_lastupdated_by;
            delete element.fm_lastupdated_date;
          });
        }

        let freightmasterheader = Config.masterfilesheaders.freightmaster;
        listData = listData.map(item => {
          return {
            [freightmasterheader[0]]: item.articleno,
            [freightmasterheader[1]]: item.owf,
            [freightmasterheader[2]]: item.adjfactorone,
            [freightmasterheader[3]]: item.adjfactortwo,
            [freightmasterheader[4]]: item.adjfactorthree,
            [freightmasterheader[5]]: item.adjfactorfour,
            [freightmasterheader[6]]: item.adjfactorfive,
            [freightmasterheader[7]]: item.adjfactorsix
          };
        });

        let fileName = 'Freight Factor Master - ' + this.createdDate;
        this.appService.exportAsExcelFile(listData, fileName);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public exportfiles(file: any) {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/freightmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.freightfactor;
    FileSaver.saveAs(url, SampleEnum.freightfactor);
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

  readExcel() {
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

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: true, defval: null });
    this.importData = this.jsonData;
    let data = [];
    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.freightmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.freightmaster)) {
      this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
      return false;
    } else
      return true;
  }

  public uploadFile(file) {
    this.rmcostmasterservice.upload(file, this.type).subscribe(
      response => {
        this.filename = response;
        this.saveData(this.filename.toString());
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private saveData(fileresponse: any) {
    this.freightfactorService.importfreightfactordata(fileresponse).subscribe(
      response => {
        if (response) {
          this.savedResult = response.result;
          this.isShowDownload = true;
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/freightmaster/logs/' + this.savedResult.status_file_name;
          FileSaver.saveAs(url, this.savedResult.status_file_name);
          this.notificationService.showSuccess("Imported Successfully");
          this.getCount(this.searchValue);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onFreightMasterDelete(event) {
    this.freightfactorService.deletefreightmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount(this.searchValue);
          this.notificationService.showSuccess('Freight Factor deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditFreightMasterPopup(id: number) {
    if (id) {
      this.freightfactorService.getfreightMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.freightmasterId = response.data[0].id;
            this.freightMasterForm.articleno.setValue(response.data[0].articleno);
            this.freightMasterForm.owf.setValue(response.data[0].owf);
            this.freightMasterForm.adjfactorone.setValue(response.data[0].adjfactorone);
            this.freightMasterForm.adjfactortwo.setValue(response.data[0].adjfactortwo);
            this.freightMasterForm.adjfactorthree.setValue(response.data[0].adjfactorthree);
            this.freightMasterForm.adjfactorfour.setValue(response.data[0].adjfactorfour);
            this.freightMasterForm.adjfactorfive.setValue(response.data[0].adjfactorfive);
            this.freightMasterForm.adjfactorsix.setValue(response.data[0].adjfactorsix)
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.freightmasterId = null;
      this.freightMasterForm.articleno.setValue(null);
      this.freightMasterForm.owf.setValue(null);
      this.freightMasterForm.adjfactorone.setValue(null);
      this.freightMasterForm.adjfactortwo.setValue(null);
      this.freightMasterForm.adjfactorthree.setValue(null);
      this.freightMasterForm.adjfactorfour.setValue(null);
      this.freightMasterForm.adjfactorfive.setValue(null);
      this.freightMasterForm.adjfactorsix.setValue(null)
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }

  onFreightMasterSaveClick() {
    this.submitted = true;

    if (this.FreightMasterForm.invalid)
      return;

    if (this.freightMasterForm.owf.value > 0.99
      || this.freightMasterForm.adjfactorone.value > 0.99
      || this.freightMasterForm.adjfactortwo.value > 0.99
      || this.freightMasterForm.adjfactorthree.value > 0.99
      || this.freightMasterForm.adjfactorfour.value > 0.99
      || this.freightMasterForm.adjfactorfive.value > 0.99
      || this.freightMasterForm.adjfactorsix.value > 0.99)
      return;

    let freightmasterheader = Config.masterfilesheaders.freightmaster;
    let freightmastersavemodel = [{
      [freightmasterheader[0]]: this.freightMasterForm.articleno.value,
      [freightmasterheader[1]]: this.freightMasterForm.owf.value ? this.freightMasterForm.owf.value : 0,
      [freightmasterheader[2]]: this.freightMasterForm.adjfactorone.value ? this.freightMasterForm.adjfactorone.value : 0,
      [freightmasterheader[3]]: this.freightMasterForm.adjfactortwo.value ? this.freightMasterForm.adjfactortwo.value : 0,
      [freightmasterheader[4]]: this.freightMasterForm.adjfactorthree.value ? this.freightMasterForm.adjfactorthree.value : 0,
      [freightmasterheader[5]]: this.freightMasterForm.adjfactorfour.value ? this.freightMasterForm.adjfactorfour.value : 0,
      [freightmasterheader[6]]: this.freightMasterForm.adjfactorfive.value ? this.freightMasterForm.adjfactorfive.value : 0,
      [freightmasterheader[7]]: this.freightMasterForm.adjfactorsix.value ? this.freightMasterForm.adjfactorsix.value : 0
    }]

    this.freightfactorService.savefreightmaster(freightmastersavemodel).subscribe(
      response => {
        this.getCount(this.searchValue);
        this.notificationService.showSuccess('Freight Factor saved successfully. It will take 20 minutes to reflect in offer.');
        this.modalService.dismissAll();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}