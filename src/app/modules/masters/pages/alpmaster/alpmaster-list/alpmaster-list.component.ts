import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '@shared/directives';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { AlpmasterService } from '@core/services/masters/alpmaster.service';
import { SampleEnum } from '@core/enums/sample.enum';
import { FilesService } from '@core/services/common/files.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { PriceconfigurationalpService } from '@core/services/masters/priceconfigurationalp.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-alpmaster-list',
  templateUrl: './alpmaster-list.component.html',
  styleUrls: ['./alpmaster-list.component.css']
})
export class AlpmasterListComponent implements OnInit {

  ALPMasterForm: FormGroup;
  importmodel: FormGroup;
  FilterForm: FormGroup;
  ExportItemsForm: FormGroup;

  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  alpmasterlist: any[] = [];
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
  type: string = 'alpmaster';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  dateFormate: any;
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  @ViewChild('ExportOptiontemModal', { static: false }) ExportOptiontemModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  alpmasterId: number;
  validfromDate: { day: number; month: number; year: number; };
  validtoDate: { day: number; month: number; year: number; };
  todayMinDate: { year: number; month: number; day: number };
  ValidMindate: any;
  todayDate: any;
  futureDate: any;
  iscostfromerror: boolean = false;
  ALPTypeList: any[] = [
    { code: -1, description: 'All' },
    { code: 1, description: 'Fixed ALP' },
    { code: 0, description: 'Variable ALP' }];
  ALPErrorTypeList: any[] = [
    { code: -1, description: 'All' },
    { code: 0, description: 'Errors' }];
  dwnldforImportALP: boolean = true;
  dwnldCurrentList: boolean = false;
  dwnldReleasedALPListExcel: boolean = false;
  dwnldReleasedALPListPDF: boolean = false;
  IsFixedALPFlag: boolean = false;
  ShowFixedALPField: boolean = false;
  delCurrent: any;
  lmeCurrent: any;
  CostFromList: any[] = [];
  viewOnly: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private filesService: FilesService,
    private standarditemService: StandarditemService,
    private alpmasterService: AlpmasterService,
    public formatter: NgbDateParserFormatter,
    public priceconfigurationalpService: PriceconfigurationalpService,
    private notificationService: NotificationService
  ) {
    this.CostFromList = [{ code: 'M', description: 'M' }, { code: 'T', description: 'T' }]
  }

  get alpMasterForm() { return this.ALPMasterForm.controls }
  get filterForm() { return this.FilterForm.controls }
  get exportItemsForm() { return this.ExportItemsForm.controls }

  ngOnInit() {
    if (this.router.url.includes('view'))
      this.viewOnly = true;

    this.onLoad();
    this.dateFormate = this.authService.getDateFormat();
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment(new Date(9999, 11, 31)).format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.onBuildForm();
    this.loadPageData();
    this.getCount();

    this.validfromDate = this.convertDate(this.todayDate);
    this.validtoDate = this.convertDate(this.futureDate);
    this.alpMasterForm.validfrom.setValue(this.todayDate);
    this.alpMasterForm.validto.setValue(this.futureDate);
  }

  public onBuildForm() {
    this.FilterForm = this.formBuilder.group({
      alptype: [-1],
      alperror: [-1]
    });

    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.ExportItemsForm = this.formBuilder.group({
      exportoption: [null]
    });

    this.ALPMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      alp: [null],
      msq: [null, [Validators.required]],
      validfrom: [null, [Validators.required]],
      validto: [null, [Validators.required]],
      costfrom: [null],
      alpchangeper: [null]
    });
  }

  loadPageData() {
    this.getPriceConfiguration('del');
    this.getPriceConfiguration('lme');
  }

  onValidFromDateSelection(date) {
    this.ValidMindate = date;
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateFormate);
    this.alpMasterForm.validfrom.setValue(offerValidFromdate);
  }

  onValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateFormate);
    this.alpMasterForm.validto.setValue(offerValidTodate);
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { day: day, month: month, year: year };
    return newdate;
  }

  public getCount() {
    let filtermodel = { searchValue: this.searchValue, alptype: this.filterForm.alptype.value, alperror: this.filterForm.alperror.value }
    this.alpmasterService.getALPMasterCount(filtermodel).subscribe(
      response => {
        if (response) {
          this.totalRows = response.responsedata[0].count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.alpmasterlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, alptype: this.filterForm.alptype.value, alperror: this.filterForm.alperror.value, isexport: false }

    this.alpmasterService.getALPMasterList(filtermodel).subscribe(
      response => {
        this.alpmasterlist = response.responsedata;
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

    var table = document.getElementById('table-alpmaster');
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
    this.router.navigateByUrl('masters/alpmaster/logs');
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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.alpmaster;
    FileSaver.saveAs(url, SampleEnum.alpmaster);
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
      if (data.length != Config.masterfilesheaders.alpmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.alpmaster)) {
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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/alpmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    this.alpmasterService.importalpmaster(fileresponse).subscribe(
      response => {
        // this.savedResult = response.result;
        // this.isShowDownload = true;
        // let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/alpmaster/logs/' + this.savedResult.status_file_name;
        // FileSaver.saveAs(url, this.savedResult.status_file_name);
        // this.notificationService.showSuccess("Imported Successfully");
        this.modalService.dismissAll();
        this.notificationService.showInfo('Importing data is inprogress in background. Please check the status in history after sometime.');
        this.getCount();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public onExport() {
    this.dwnldforImportALP = true;
    this.dwnldCurrentList = false;
    this.dwnldReleasedALPListExcel = false;
    this.dwnldReleasedALPListPDF = false;

    this.modalService.open(this.ExportOptiontemModal, { size: 'md', backdrop: 'static' });
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onALPMasterDelete(event) {
    this.alpmasterService.deletealpmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess('ALP Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditALPMasterPopup(id: number) {
    if (id) {
      this.alpmasterService.getalpMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.alpmasterId = response.data[0].id;
            this.alpMasterForm.articleno.setValue(response.data[0].articleno);
            this.alpMasterForm.alp.setValue(response.data[0].alp);
            this.alpMasterForm.msq.setValue(response.data[0].msq);

            if (response.data[0].validfrom && response.data[0].validfrom != '0000-00-00') {
              this.validfromDate = this.convertDate(this.datePipe.transform(response.data[0].validfrom, this.dateFormate));
              this.alpMasterForm.validfrom.setValue(this.datePipe.transform(response.data[0].validfrom, this.dateFormate));
            } else {
              this.validfromDate = this.convertDate(this.todayDate);
            }

            if (response.data[0].validto && response.data[0].validto != '0000-00-00') {
              this.validtoDate = this.convertDate(this.datePipe.transform(response.data[0].validto, this.dateFormate));
              this.alpMasterForm.validto.setValue(this.datePipe.transform(response.data[0].validto, this.dateFormate));
            } else
              this.validtoDate = this.convertDate(this.futureDate);

            this.IsFixedALPFlag = response.data[0].isfixedalp == 0 ? false : true;
            this.ShowFixedALPField = this.IsFixedALPFlag == true ? false : true;

            this.alpMasterForm.costfrom.setValue(response.data[0].costfrom);
            this.alpMasterForm.alpchangeper.setValue(response.data[0].alpchangeper);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.alpmasterId = null;
      this.alpMasterForm.articleno.setValue(null);
      this.alpMasterForm.alp.setValue(null);
      this.alpMasterForm.msq.setValue(null);
      this.validfromDate = this.convertDate(this.todayDate);
      this.validtoDate = this.convertDate(this.futureDate);
      this.alpMasterForm.validfrom.setValue(this.todayDate);
      this.alpMasterForm.validto.setValue(this.futureDate);
      this.alpMasterForm.costfrom.setValue(null);
      this.alpMasterForm.alpchangeper.setValue(null);
      this.IsFixedALPFlag = true;
      this.ShowFixedALPField = false;
    }

    this.submitted = false;
    this.onIsFixedALPChange(true);
    this.modalService.open(this.AddEditItemModal, { size: 'md', backdrop: 'static' });
  }

  onALPMasterSaveClick() {
    this.submitted = true;

    if (this.ALPMasterForm.invalid)
      return;

    if (this.alpMasterForm.alpchangeper.value > 0.99)
      return;
    // if (!this.IsFixedALPFlag && !(this.alpMasterForm.costfrom.value == 'M' || this.alpMasterForm.costfrom.value == 'T'))
    //   this.iscostfromerror = true;
    // else
    //   this.iscostfromerror = false;

    // if (this.iscostfromerror)
    //   return;

    let alpmasterheader = Config.masterfilesheaders.alpmaster;
    let alpmastersavemodel = [{
      [alpmasterheader[0]]: this.alpMasterForm.articleno.value,
      [alpmasterheader[1]]: this.alpMasterForm.msq.value,
      [alpmasterheader[2]]: this.IsFixedALPFlag,
      [alpmasterheader[3]]: this.alpMasterForm.alp.value ? this.alpMasterForm.alp.value : 0,
      [alpmasterheader[4]]: this.alpMasterForm.costfrom.value,
      [alpmasterheader[5]]: this.alpMasterForm.alpchangeper.value,
      [alpmasterheader[6]]: this.alpMasterForm.validfrom.value,
      [alpmasterheader[7]]: this.alpMasterForm.validto.value
    }]

    this.alpmasterService.savealpmaster(alpmastersavemodel).subscribe(
      response => {
        this.getCount();
        this.modalService.dismissAll();
        this.notificationService.showSuccess('ALP Master saved successfully. It will take 20 minutes to reflect in offer.');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onFilterALPTypeChange(event: any) {
    if (!event)
      this.filterForm.alptype.setValue(-1);

    this.getCount();
  }

  onFilterALPErrorTypeChange(event: any) {
    if (!event)
      this.filterForm.alperror.setValue(-1);

    this.getCount();
  }

  onCalculateClick() {
    this.alpmasterService.calculatealp().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onReleaseClick() {
    this.alpmasterService.releasealp().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExportOptionChange(event: any) {
    // 0: Download for import ALP
    // 1: Download Current List

    if (event.target.value == '0') {
      this.dwnldforImportALP = true;
      this.dwnldCurrentList = false;
      this.dwnldReleasedALPListExcel = false;
      this.dwnldReleasedALPListPDF = false;
    } else if (event.target.value == '1') {
      this.dwnldforImportALP = false;
      this.dwnldCurrentList = true;
      this.dwnldReleasedALPListExcel = false;
      this.dwnldReleasedALPListPDF = false;
    } else if (event.target.value == '2') {
      this.dwnldforImportALP = false;
      this.dwnldCurrentList = false;
      this.dwnldReleasedALPListExcel = true;
      this.dwnldReleasedALPListPDF = false;
    } else if (event.target.value == '3') {
      this.dwnldforImportALP = false;
      this.dwnldCurrentList = false;
      this.dwnldReleasedALPListExcel = false;
      this.dwnldReleasedALPListPDF = true;
    }
  }

  onExportClick() {
    if (this.dwnldforImportALP) {
      this.filterForm.alptype.setValue(-1);
      this.filterForm.alperror.setValue(-1);
    }

    if (this.dwnldforImportALP)
      this.onExportALPList();
    else if (this.dwnldCurrentList)
      this.onExportALPList();
    if (this.dwnldReleasedALPListExcel)
      this.onReleaseALPExcelCLick();
    else if (this.dwnldReleasedALPListPDF)
      this.onReleaseALPPDFCLick();

  }

  onExportALPList() {
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, alptype: this.filterForm.alptype.value, alperror: this.filterForm.alperror.value, isexport: true }
    this.alpmasterService.getALPMasterList(filtermodel).pipe().subscribe(
      response => {
        this.exportdatalist = response.responsedata;
        let listData = []


        listData = this.exportdatalist;

        listData.forEach(element => {
          delete element.id;
          element.validfrom = this.datePipe.transform(element.validfrom, this.dateFormate);
          element.validto = this.datePipe.transform(element.validto, this.dateFormate);
        });

        let alpmasterheader: any = [];

        if (this.dwnldforImportALP) {
          alpmasterheader = Config.masterfilesheaders.alpmaster;

          listData = listData.map(item => {
            return {
              [alpmasterheader[0]]: item.articleno,
              [alpmasterheader[1]]: item.msq,
              [alpmasterheader[2]]: item.isfixedalp,
              [alpmasterheader[3]]: item.alp,
              [alpmasterheader[4]]: item.costfrom,
              [alpmasterheader[5]]: item.alpchangeper,
              [alpmasterheader[6]]: item.validfrom,
              [alpmasterheader[7]]: item.validto
            };
          });
        } else if (this.dwnldCurrentList) {
          alpmasterheader = Config.masterfilesheaders.exportalpmasterlist;

          listData = listData.map(item => {
            return {
              [alpmasterheader[0]]: item.articleno,
              [alpmasterheader[1]]: item.msq,
              [alpmasterheader[2]]: item.isfixedalp,
              [alpmasterheader[3]]: item.alp,
              [alpmasterheader[4]]: item.costfrom,
              [alpmasterheader[5]]: item.alpchangeper,
              [alpmasterheader[6]]: item.validfrom,
              [alpmasterheader[7]]: item.validto,
              [alpmasterheader[8]]: item.fixedalp_c,
              [alpmasterheader[9]]: item.fixedalpcalerror
            };
          });
        }

        let fileName = 'ALP Master - ' + this.createdDate;
        this.appService.exportAsExcelFile(listData, fileName);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onIsFixedALPChange(isChecked: any) {
    if (isChecked)
      this.IsFixedALPFlag = isChecked;
    else
      this.IsFixedALPFlag = false;

    if (!this.IsFixedALPFlag) {
      this.ShowFixedALPField = true;
      this.alpMasterForm.costfrom.setValidators(Validators.required);
      this.iscostfromerror = false;
      this.alpMasterForm.alpchangeper.setValidators(Validators.required);
      this.alpMasterForm.alp.clearValidators();
    } else {
      this.ShowFixedALPField = false;
      this.alpMasterForm.alp.setValidators(Validators.required);
      this.alpMasterForm.costfrom.clearValidators();
      this.alpMasterForm.alpchangeper.clearValidators();
    }

    this.alpMasterForm.alp.updateValueAndValidity();
    this.alpMasterForm.costfrom.updateValueAndValidity();
    this.alpMasterForm.alpchangeper.updateValueAndValidity();
  }

  onReleaseALPExcelCLick() {
    this.alpmasterService.releasealpexcel().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          let listData = response.responsedata.data;

          if (listData && listData.length == 0) {
            this.notificationService.showError('There is no data to export');
            return;
          }

          let releasealpheader = Config.masterfilesheaders.releasealp;

          listData = listData.map(item => {
            return {
              [releasealpheader[0]]: item.articleno,
              [releasealpheader[1]]: item.description,
              [releasealpheader[2]]: item.alp,
              [releasealpheader[3]]: item.uom,
              [releasealpheader[4]]: item.validfrom
            };
          });

          let fileName = 'Release ALP - ' + this.createdDate;
          this.appService.exportAsExcelFile(listData, fileName);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onReleaseALPPDFCLick() {
    this.alpmasterService.releasealppdf().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          let filename = response.responsedata.data.filename.split('\\')[response.responsedata.data.filename.split('\\').length - 1];
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/releasealppdf/' + filename;
          FileSaver.saveAs(url, filename);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getPriceConfiguration(code: string) {
    this.priceconfigurationalpService.getPriceConfiguration(code).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (code == 'del')
            this.delCurrent = response.responsedata.data;
          else if (code == 'lme')
            this.lmeCurrent = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}