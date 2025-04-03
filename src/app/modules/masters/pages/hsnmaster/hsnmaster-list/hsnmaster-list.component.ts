import { Component, OnInit, ViewChild } from '@angular/core';
import { PagerService } from '@shared/directives';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FilesService } from '@core/services/common/files.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SampleEnum } from '@core/enums/sample.enum';
import { StandarditemService } from 'src/app/core/services/masters/standarditem.service';
import { HsnmasterService } from '@core/services/masters/hsnmaster.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-hsnmaster-list',
  templateUrl: './hsnmaster-list.component.html',
  styleUrls: ['./hsnmaster-list.component.css']
})
export class HsnmasterListComponent implements OnInit {

  HSNMasterForm: FormGroup;
  importmodel: FormGroup;

  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  hsnmasterlist: any[] = [];
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
  type: string = 'hsnmaster';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  hsnmasterId: number;
  viewOnly: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private filesService: FilesService,
    private standarditemService: StandarditemService,
    private hsnmasterService: HsnmasterService,
    private notificationService: NotificationService
  ) { }

  get hsnMasterForm() { return this.HSNMasterForm.controls }

  ngOnInit() {
    if (this.router.url.includes('view'))
      this.viewOnly = true;

    this.onLoad();
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onBuildForm();
    this.getCount(this.searchValue);
  }

  public onBuildForm() {
    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.HSNMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      hsncode: [null, [Validators.required]],
      bcd: [null],
      freightandinsurance: [null],
      landingcharges: [null],
      clearingcharges: [null],
      inlandfreight: [null],
      cess1: [null],
      cess2: [null],
      cess3: [null],
      cess4: [null],
      othercharges: [null],
      fbd: [null],
    });
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.hsnmaster;
    FileSaver.saveAs(url, SampleEnum.hsnmaster);
  }

  public getCount(searchValue) {
    this.hsnmasterService.getHSNMasterCount(searchValue).subscribe(
      response => {
        if (response) {
          this.totalRows = response.hsnmaster[0].count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.hsnmasterlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.hsnmasterService.getHSNMasterList(filtermodel).subscribe(
      response => {
        this.hsnmasterlist = response.hsnmaster;
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

    var table = document.getElementById('table-hsnmaster');
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
    this.router.navigateByUrl('masters/hsnmaster/logs');
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
      if (data.length != Config.masterfilesheaders.hsnmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.hsnmaster)) {
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
        this.saveData(this.filename.toString());
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public exportfiles(file: any) {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/hsnmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    this.hsnmasterService.importhsnmaster(fileresponse).subscribe(
      response => {
        if (response) {
          this.savedResult = response.result;
          this.isShowDownload = true;
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/hsnmaster/logs/' + this.savedResult.status_file_name;
          FileSaver.saveAs(url, this.savedResult.status_file_name);
          this.notificationService.showSuccess("Imported successfully.");
          this.getCount(this.searchValue);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public onExport() {
    let searchObj = "";
    if(this.searchValue)
      searchObj = JSON.stringify({filters:{search:this.searchValue}});
      
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: searchObj, sortField: this.sortField,userId: this.authService.getUserId()}
    this.hsnmasterService.initiateExportHsnMaster(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          console.log("Data : ",response.responsedata);
          //this.notificationService.showSuccess("Product Master export file generated successfully");
          this.notificationService.showInfo("The file export is in process and will be available to download in few minutes");
          this.router.navigateByUrl('masters/hsnmaster/downloads');
          
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
        console.log("Error :: ",error);
      });
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onHSNMasterDelete(event) {
    this.hsnmasterService.deletehsnmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount(this.searchValue);
          this.notificationService.showSuccess('HSN Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditHSNMasterPopup(id: number) {
    if (id) {
      this.hsnmasterService.getHSNMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.hsnmasterId = response.data[0].id;
            this.hsnMasterForm.articleno.setValue(response.data[0].articleno);
            this.hsnMasterForm.hsncode.setValue(response.data[0].hsncode);
            this.hsnMasterForm.bcd.setValue(response.data[0].bcd);
            this.hsnMasterForm.freightandinsurance.setValue(response.data[0].freightandinsurance);
            this.hsnMasterForm.landingcharges.setValue(response.data[0].landingcharges);
            this.hsnMasterForm.clearingcharges.setValue(response.data[0].clearingcharges);
            this.hsnMasterForm.inlandfreight.setValue(response.data[0].inlandfreight);
            this.hsnMasterForm.cess1.setValue(response.data[0].cess1);
            this.hsnMasterForm.cess2.setValue(response.data[0].cess2);
            this.hsnMasterForm.cess3.setValue(response.data[0].cess3);
            this.hsnMasterForm.cess4.setValue(response.data[0].cess4);
            this.hsnMasterForm.othercharges.setValue(response.data[0].othercharges);
            this.hsnMasterForm.fbd.setValue(response.data[0].fbd);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.hsnmasterId = null;
      this.hsnMasterForm.articleno.setValue(null);
      this.hsnMasterForm.hsncode.setValue(null);
      this.hsnMasterForm.bcd.setValue(null);
      this.hsnMasterForm.freightandinsurance.setValue(null);
      this.hsnMasterForm.landingcharges.setValue(null);
      this.hsnMasterForm.clearingcharges.setValue(null);
      this.hsnMasterForm.inlandfreight.setValue(null);
      this.hsnMasterForm.cess1.setValue(null);
      this.hsnMasterForm.cess2.setValue(null);
      this.hsnMasterForm.cess3.setValue(null);
      this.hsnMasterForm.cess4.setValue(null);
      this.hsnMasterForm.othercharges.setValue(null);
      this.hsnMasterForm.fbd.setValue(null);
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }

  onHSNMasterSaveClick() {
    this.submitted = true;

    if (this.HSNMasterForm.invalid)
      return;

    if (this.hsnMasterForm.bcd.value > 0.99
      || this.hsnMasterForm.freightandinsurance.value > 0.99
      || this.hsnMasterForm.landingcharges.value > 0.99
      || this.hsnMasterForm.clearingcharges.value > 0.99
      || this.hsnMasterForm.inlandfreight.value > 0.99
      || this.hsnMasterForm.cess1.value > 0.99
      || this.hsnMasterForm.cess2.value > 0.99
      || this.hsnMasterForm.cess3.value > 0.99
      || this.hsnMasterForm.cess4.value > 0.99
      || this.hsnMasterForm.othercharges.value > 0.99
      || this.hsnMasterForm.fbd.value > 0.99)
      return;

    let hsnmasterheader = Config.masterfilesheaders.hsnmaster;
    let hsnmastersavemodel = [{
      [hsnmasterheader[0]]: this.hsnMasterForm.articleno.value,
      [hsnmasterheader[1]]: this.hsnMasterForm.hsncode.value,
      [hsnmasterheader[2]]: this.hsnMasterForm.bcd.value ? this.hsnMasterForm.bcd.value : 0,
      [hsnmasterheader[3]]: this.hsnMasterForm.freightandinsurance.value ? this.hsnMasterForm.freightandinsurance.value : 0,
      [hsnmasterheader[4]]: this.hsnMasterForm.landingcharges.value ? this.hsnMasterForm.landingcharges.value : 0,
      [hsnmasterheader[5]]: this.hsnMasterForm.clearingcharges.value ? this.hsnMasterForm.clearingcharges.value : 0,
      [hsnmasterheader[6]]: this.hsnMasterForm.inlandfreight.value ? this.hsnMasterForm.inlandfreight.value : 0,
      [hsnmasterheader[7]]: this.hsnMasterForm.cess1.value ? this.hsnMasterForm.cess1.value : 0,
      [hsnmasterheader[8]]: this.hsnMasterForm.cess2.value ? this.hsnMasterForm.cess2.value : 0,
      [hsnmasterheader[9]]: this.hsnMasterForm.cess3.value ? this.hsnMasterForm.cess3.value : 0,
      [hsnmasterheader[10]]: this.hsnMasterForm.cess4.value ? this.hsnMasterForm.cess4.value : 0,
      [hsnmasterheader[11]]: this.hsnMasterForm.othercharges.value ? this.hsnMasterForm.othercharges.value : 0,
      [hsnmasterheader[12]]: this.hsnMasterForm.fbd.value ? this.hsnMasterForm.fbd.value : 0
    }]

    this.hsnmasterService.savehsnmaster(hsnmastersavemodel).subscribe(
      response => {
        this.getCount(this.searchValue);
        this.notificationService.showSuccess('HSN Master saved successfully. It will take 20 minutes to reflect in offer.');
        this.modalService.dismissAll();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getDownload() {
    this.router.navigateByUrl('masters/hsnmaster/downloads');
  }
}