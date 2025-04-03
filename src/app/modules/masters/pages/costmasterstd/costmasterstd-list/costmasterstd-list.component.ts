import { Component, OnInit, ViewChild } from '@angular/core';
import { PagerService } from '@shared/directives';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SampleEnum } from '@core/enums/sample.enum';
import { StandarditemService } from 'src/app/core/services/masters/standarditem.service';
import { CostmasterstdService } from '@core/services/masters/costmasterstd.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-costmasterstd-list',
  templateUrl: './costmasterstd-list.component.html',
  styleUrls: ['./costmasterstd-list.component.css']
})
export class CostmasterstdListComponent implements OnInit {

  importmodel: FormGroup;
  CostMasterForm: FormGroup;
  OmpManageCostMasterForm: FormGroup;
  ExportTypeForm: FormGroup;

  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  rmcostmasterlist: any[] = [];
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
  type: string = 'costmasterstd';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  productTypeList: any[] = [
    { code: 'STD', description: 'Standard(MFG)' },
    { code: 'TRD', description: 'Trading(TRD)' }];
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'USD', description: 'USD' },
    { code: 'EUR', description: 'EUR' }];
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  @ViewChild('OmpManageAddEditItemModal', { static: false }) OmpManageAddEditItemModal: any;
  @ViewChild('ExportTypeModal', { static: false }) ExportTypeModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  costmasterId: number;
  om_costmasterId: number;
  productTypeSTD: boolean = true;
  productTypeTRD: boolean = false;
  dateformate: string;
  todayDate: any;
  futureDate: any;
  ValidMaxdate: any;
  ValidMindate: any;
  todayMinDate: { year: number; month: number; day: number };
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  viewOnly: boolean = false;
  canSAPCostStdRefresh: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private standarditemService: StandarditemService,
    private costmasterstdService: CostmasterstdService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private notificationService: NotificationService
  ) { }

  get importrmcost() { return this.importmodel.controls }
  get costMasterForm() { return this.CostMasterForm.controls }
  get ompManageCostMasterForm() { return this.OmpManageCostMasterForm.controls }
  get exportTypeForm() { return this.ExportTypeForm.controls }

  ngOnInit() {
    if (this.router.url.includes('view'))
      this.viewOnly = true;
     
    let userRoleCode = this.authService.getUserRoleCode();
    if(userRoleCode === 'Admin' || userRoleCode === 'FM')
      this.canSAPCostStdRefresh = true;

    this.onLoad();
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.onBuildForm();
    this.getCount();

    this.validfromDate = this.convertDate(this.todayDate);
    this.validtoDate = this.convertDate(this.futureDate);
    this.costMasterForm.validfrom.setValue(this.todayDate);
    this.costMasterForm.validto.setValue(this.futureDate);
  }

  public onBuildForm() {
    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.CostMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      primaryplant: [null, [Validators.required]],
      currency: ['INR', [Validators.required]],
      standardcost: [null],
      copperweight: [null],
      copperindex: [null],
      baseprice: [null],
      copperbasecost: [null],
      otherrmc: [null],
      overhead: [null],
      fixedoverheads: [null],
      moq: [null, [Validators.required]],
      validfrom: [null],
      validto: [null]
    });

    this.OmpManageCostMasterForm = this.formBuilder.group({
      om_articleno: [null],
      om_primaryplant: [null, [Validators.required]],
      om_moq: [null, [Validators.required]]
    });
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }

  onValidFromDateSelection(date) {
    this.ValidMindate = date;
    let ValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    let maxdate = moment(ValidFromdate).add(30, 'd').format('YYYY-MM-DD');
    this.ValidMaxdate = this.convertDate(maxdate);
    ValidFromdate = this.datePipe.transform(ValidFromdate, this.dateformate);
    this.costMasterForm.validfrom.setValue(ValidFromdate);
  }

  onValidToDateSelection(date) {
    let ValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    ValidTodate = this.datePipe.transform(ValidTodate, this.dateformate);
    this.costMasterForm.validto.setValue(ValidTodate);
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.stdcostmaster;
    FileSaver.saveAs(url, SampleEnum.stdcostmaster);
  }

  public getCount() {
    let filtermodel = { searchValue: this.searchValue }
    this.costmasterstdService.getCostMasterCount(filtermodel).subscribe(
      response => {
        if (response) {
          this.totalRows = response.costcount[0].count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.rmcostmasterlist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.costmasterstdService.getRMCostmasterList(filtermodel).subscribe(
      response => {
        this.rmcostmasterlist = response.costList;
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

    var table = document.getElementById('table-rmcostmaster');
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
    this.router.navigateByUrl('masters/costmasterstd/logs');
  }

  public open(content) {
    this.submitted = false;
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
    this.submitted = true;
    if (this.importmodel.invalid)
      return;

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
      if (data.length != Config.masterfilesheaders.costmasterstd.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.costmasterstd)) {
      this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
      return false;
    }

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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmasterstd/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    this.costmasterstdService.importcostmaster(fileresponse).subscribe(
      response => {
        if (response) {
          // this.savedResult = response.result;
          // this.isShowDownload = true;
          // let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmasterstd/logs/' + this.savedResult.status_file_name;
          // FileSaver.saveAs(url, this.savedResult.status_file_name);
          // this.notificationService.showSuccess("Imported successfully.");
          this.modalService.dismissAll();
          this.notificationService.showInfo('Importing data is inprogress in background. Please check the status in history after sometime.');
          this.getCount();
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
    this.costmasterstdService.initiateExportCostMaster(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          console.log("Data : ",response.responsedata);
          //this.notificationService.showSuccess("Product Master export file generated successfully");
          this.notificationService.showInfo("The file export is in process and will be available to download in few minutes");
          this.router.navigateByUrl('masters/costmasterstd/downloads');
          
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

  onProductMasterDelete(event) {
    this.costmasterstdService.deletecostmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess('Cost Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  OpenOmpManageAddEditCostMasterPopup(id: number){
    if (id) {
      this.costmasterstdService.getCostMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.om_costmasterId = response.data[0].id;
            this.ompManageCostMasterForm.om_articleno.setValue(response.data[0].articleno);
            this.ompManageCostMasterForm.om_primaryplant.setValue(response.data[0].primaryplant);
            this.ompManageCostMasterForm.om_moq.setValue(response.data[0].moq);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });

        this.submitted = false;
      this.modalService.open(this.OmpManageAddEditItemModal, { size: 'lg', backdrop: 'static' });
    } 
    
  }
  OpenAddEditCostMasterPopup(id: number) {
    if (id) {
      this.costmasterstdService.getCostMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.costmasterId = response.data[0].id;
            this.costMasterForm.articleno.setValue(response.data[0].articleno);
            this.costMasterForm.primaryplant.setValue(response.data[0].primaryplant);
            this.costMasterForm.currency.setValue(response.data[0].currency);
            this.costMasterForm.standardcost.setValue(response.data[0].standardcost);
            this.costMasterForm.copperweight.setValue(response.data[0].copperweight);
            this.costMasterForm.copperindex.setValue(response.data[0].copperindex);
            this.costMasterForm.baseprice.setValue(response.data[0].baseprice);
            this.costMasterForm.copperbasecost.setValue(response.data[0].copper_base_cost);
            this.costMasterForm.otherrmc.setValue(response.data[0].other_rmc);
            this.costMasterForm.overhead.setValue(response.data[0].overheads);
            this.costMasterForm.fixedoverheads.setValue(response.data[0].fixedoverheads);
            this.costMasterForm.moq.setValue(response.data[0].moq);

            this.validfromDate = this.convertDate(this.datePipe.transform(response.data[0].validfrom, this.dateformate));
            this.validtoDate = this.convertDate(this.datePipe.transform(response.data[0].validto, this.dateformate));

            this.costMasterForm.validfrom.setValue(this.datePipe.transform(response.data[0].validfrom, this.dateformate));
            this.costMasterForm.validto.setValue(this.datePipe.transform(response.data[0].validto, this.dateformate));
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.costmasterId = null;
      this.costMasterForm.articleno.setValue(null);
      this.costMasterForm.primaryplant.setValue(null);
      this.costMasterForm.currency.setValue('INR');
      this.costMasterForm.standardcost.setValue(null);
      this.costMasterForm.copperweight.setValue(null);
      this.costMasterForm.copperindex.setValue(null);
      this.costMasterForm.baseprice.setValue(null);
      this.costMasterForm.copperbasecost.setValue(null);
      this.costMasterForm.otherrmc.setValue(null);
      this.costMasterForm.overhead.setValue(null);
      this.costMasterForm.fixedoverheads.setValue(null);
      this.costMasterForm.moq.setValue(null);
      this.costMasterForm.validfrom.setValue(this.todayDate);
      this.costMasterForm.validto.setValue(this.futureDate);
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }
  onOmpManageCostSaveClick(){
    this.submitted = true;

    if (this.OmpManageCostMasterForm.invalid && !this.om_costmasterId){
      console.log("id", this.om_costmasterId);
      return;
    }  

    if (Number(this.ompManageCostMasterForm.om_moq.value) <= 0)
      return;

    let ompmanagecostmastersavemodel = [];
    let costmasterheader = Config.masterfilesheaders.costmasterstd;

    ompmanagecostmastersavemodel.push({
      [costmasterheader[0]]: this.ompManageCostMasterForm.om_articleno.value,
      [costmasterheader[1]]: this.ompManageCostMasterForm.om_primaryplant.value,
      [costmasterheader[11]]: this.ompManageCostMasterForm.om_moq.value ? this.ompManageCostMasterForm.om_moq.value : 1,
      ompmanagecostmaster_id: this.om_costmasterId
    });

    this.costmasterstdService.saveompmanagecostmaster(ompmanagecostmastersavemodel).subscribe(
      response => {
        this.getCount();
        this.modalService.dismissAll();
        this.notificationService.showSuccess('Cost Master updated successfully.');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  onCostSaveClick() {
    this.submitted = true;

    if (this.CostMasterForm.invalid)
      return;

    if (Number(this.costMasterForm.moq.value) <= 0)
      return;

    let isstdcostavailable = false;
    let istrdcostavailable = false;
    if (this.costMasterForm.standardcost.value && this.costMasterForm.standardcost.value > 0) {
      isstdcostavailable = true;
    }

    if (this.costMasterForm.copperweight.value && this.costMasterForm.baseprice.value
      && this.costMasterForm.copperbasecost.value && this.costMasterForm.overhead.value) {
      istrdcostavailable = true;
    }

    if (!isstdcostavailable && !istrdcostavailable) {
      this.notificationService.showError('Either standard cost or other cost imformation is required.');
      return;
    }

    let costmastersavemodel = [];
    let costmasterheader = Config.masterfilesheaders.costmasterstd;

    costmastersavemodel.push({
      [costmasterheader[0]]: this.costMasterForm.articleno.value,
      [costmasterheader[1]]: this.costMasterForm.primaryplant.value,
      [costmasterheader[2]]: this.costMasterForm.currency.value,
      [costmasterheader[3]]: this.costMasterForm.standardcost.value ? this.costMasterForm.standardcost.value : 0,
      [costmasterheader[4]]: this.costMasterForm.copperweight.value ? this.costMasterForm.copperweight.value : 0,
      [costmasterheader[5]]: this.costMasterForm.copperindex.value ? this.costMasterForm.copperindex.value : 0,
      [costmasterheader[6]]: this.costMasterForm.baseprice.value ? this.costMasterForm.baseprice.value : 0,
      [costmasterheader[7]]: this.costMasterForm.copperbasecost.value ? this.costMasterForm.copperbasecost.value : 0,
      [costmasterheader[8]]: this.costMasterForm.otherrmc.value ? this.costMasterForm.otherrmc.value : 0,
      [costmasterheader[9]]: this.costMasterForm.overhead.value ? this.costMasterForm.overhead.value : 0,
      [costmasterheader[10]]: this.costMasterForm.fixedoverheads.value ? this.costMasterForm.fixedoverheads.value : 0,
      [costmasterheader[11]]: this.costMasterForm.moq.value ? this.costMasterForm.moq.value : 1,
      [costmasterheader[12]]: this.costMasterForm.validfrom.value,
      [costmasterheader[13]]: this.costMasterForm.validto.value
    });

    this.costmasterstdService.savecostmaster(costmastersavemodel).subscribe(
      response => {
        this.getCount();
        this.modalService.dismissAll();
        this.notificationService.showSuccess('Cost Master saved successfully. It will take 20 minutes to reflect in offer.');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getDownload() {
    this.router.navigateByUrl('masters/costmasterstd/downloads');
  }

  onSAPRefreshClick() {
    let filtermodel = {};
    this.costmasterstdService.getLappCostSet(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.getCount();
          this.notificationService.showSuccess(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}