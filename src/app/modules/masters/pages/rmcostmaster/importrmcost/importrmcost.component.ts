import { Component, OnInit, ViewChild } from '@angular/core';
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
import { RmcostmasterService } from '@core/services/masters/rmcostmaster.service';
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-importrmcost',
  templateUrl: './importrmcost.component.html',
  styleUrls: ['./importrmcost.component.css']
})
export class ImportrmcostComponent implements OnInit {

  importmodel: FormGroup;
  CostMasterForm: FormGroup;
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
  type: string = 'costmaster';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  productTypeList: any[] = [
    { code: 'STD', description: 'Standard(STD)' },
    { code: 'TRD', description: 'Trading(TRD)' }];
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'DEL', description: 'DEL' },
    { code: 'LME', description: 'LME' }];
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  @ViewChild('ExportTypeModal', { static: false }) ExportTypeModal: any;
  deleteConfirmModel = Object();
  costmasterId: number;
  productTypeSTD: boolean = true;
  productTypeTRD: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private standarditemService: StandarditemService,
    private rmcostmasterService: RmcostmasterService,
    private notificationService: NotificationService
  ) { }

  get importrmcost() { return this.importmodel.controls }
  get costMasterForm() { return this.CostMasterForm.controls }
  get exportTypeForm() { return this.ExportTypeForm.controls }

  ngOnInit() {
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
      importFile: null,
      productType: [null, [Validators.required]]
    });

    this.CostMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      description: [null, [Validators.required]],
      primaryplant: [null, [Validators.required]],
      currency: ['INR', [Validators.required]],
      standardcost: [null],
      propducttype: [null],
      copperweight: [null],
      baseprice: [null],
      copperbasecost: [null],
      otherrmc: [null],
      overhead: [null],
      copperindex: [null],
      cubase: [null],
      transferprice: [null]
    });

    this.ExportTypeForm = this.formBuilder.group({
      productType: [null, [Validators.required]]
    });
  }

  downloadSample(producttype: string) {
    let sampleofproducttype = '';
    if (producttype == 'std')
      sampleofproducttype = SampleEnum.stdcostmaster;
    else if (producttype == 'trd')
      sampleofproducttype = SampleEnum.trdcostmaster;

    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + sampleofproducttype;
    FileSaver.saveAs(url, sampleofproducttype);
  }

  public getCount(searchValue) {
    this.rmcostmasterService.getCostMasterCount(searchValue).subscribe(
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

    this.rmcostmasterService.getRMCostmasterList(filtermodel, '').subscribe(
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
    this.getCount(this.searchValue);
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
    this.router.navigateByUrl('masters/rmcostmaster/logs');
  }

  public open(content) {
    this.submitted = false;
    this.importrmcost.productType.setValue(null);
    this.isShowDownload = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.importrmcost.productType.setValue(null);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.importrmcost.productType.setValue(null);
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
    if (this.importrmcost.productType.value == 'STD') {
      for (let key in this.importData[0]) {
        if (data.length != Config.masterfilesheaders.costmasterstd.length)
          data.push(key.trim());
      }
      this.headerList = data;
    } else {
      for (let key in this.importData[0]) {
        if (data.length != Config.masterfilesheaders.costmastertrd.length)
          data.push(key.trim());
      }
      this.headerList = data;
    }

    let isFileValid: boolean = false;
    if (this.importrmcost.productType.value == 'STD') {
      if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.costmasterstd)) {
        isFileValid = true;
      }
    } else {
      if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.costmastertrd)) {
        isFileValid = true;
      }
    }

    if (isFileValid) {
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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    let productType = this.importrmcost.productType.value;
    this.rmcostmasterService.importcostmaster(fileresponse, productType).subscribe(
      response => {
        if (response) {
          this.savedResult = response.result;
          this.isShowDownload = true;
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/costmaster/logs/' + this.savedResult.status_file_name;
          FileSaver.saveAs(url, this.savedResult.status_file_name);
          this.notificationService.showSuccess("Imported successfully.");
          this.getCount(this.searchValue);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExportClicked() {
    this.submitted = false;
    this.modalService.open(this.ExportTypeModal, { size: 'sm', backdrop: 'static' });
  }

  public onExport() {
    this.submitted = true;

    if (this.ExportTypeForm.invalid)
      return;

    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.rmcostmasterService.getRMCostmasterList(filtermodel, this.exportTypeForm.productType.value).subscribe(
      response => {
        this.exportdatalist = response.costList;
        let listData = []

        if (this.exportdatalist) {
          listData = this.exportdatalist;

          listData.forEach(element => {
            delete element.cm_lastupdated_by;
            delete element.cm_lastupdated_date;
            delete element.id;
          });
        }
        let costmasterheader;
        if (this.exportTypeForm.productType.value == 'STD') {
          costmasterheader = Config.masterfilesheaders.costmasterstd;
          listData = listData.map(item => {
            return {
              [costmasterheader[0]]: item.articleno,
              [costmasterheader[1]]: item.primaryplant,
              [costmasterheader[2]]: item.currency,
              [costmasterheader[3]]: item.standardcost,
              [costmasterheader[4]]: item.copperweight,
              [costmasterheader[5]]: item.baseprice,
              [costmasterheader[6]]: item.copper_base_cost,
              [costmasterheader[7]]: item.other_rmc,
              [costmasterheader[8]]: item.overheads
            };
          });
        } else {
          costmasterheader = Config.masterfilesheaders.costmasterstd;
          listData = listData.map(item => {
            return {
              [costmasterheader[0]]: item.articleno,
              [costmasterheader[1]]: item.primaryplant,
              [costmasterheader[2]]: item.currency,
              [costmasterheader[3]]: item.standardcost,
              [costmasterheader[4]]: item.copperindex,
              [costmasterheader[5]]: item.baseprice,
              [costmasterheader[6]]: item.copper_base_cost
            };
          });
        }


        let fileName = 'Cost Master - ' + this.createdDate;
        this.appService.exportAsExcelFile(listData, fileName);

      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onProductTypeChnage(event) {
    if (event.target.value == 'std') {
      this.productTypeSTD = true;
      this.productTypeTRD = false;
    }
    else if (event.target.value == 'trd') {
      this.productTypeTRD = true;
      this.productTypeSTD = false;
    }
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onProductMasterDelete(event) {
    this.rmcostmasterService.deletecostmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount(this.searchValue);
          this.notificationService.showSuccess('Cost Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditCostMasterPopup(id: number) {
    if (id) {
      this.rmcostmasterService.getCostMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.costmasterId = response.data[0].id;
            this.costMasterForm.articleno.setValue(response.data[0].articleno);
            this.costMasterForm.description.setValue(response.data[0].description);
            this.costMasterForm.primaryplant.setValue(response.data[0].primaryplant);
            this.costMasterForm.currency.setValue(response.data[0].currency);
            this.costMasterForm.standardcost.setValue(response.data[0].standardcost);
            if (response.data[0].typeofproduct.toUpperCase() == 'STD') {
              this.productTypeSTD = true;
              this.productTypeTRD = false;
              this.costMasterForm.copperweight.setValue(response.data[0].copperweight);
              this.costMasterForm.baseprice.setValue(response.data[0].baseprice);
              this.costMasterForm.copperbasecost.setValue(response.data[0].copper_base_cost);
              this.costMasterForm.otherrmc.setValue(response.data[0].other_rmc);
              this.costMasterForm.overhead.setValue(response.data[0].overheads);
            } else if (response.data[0].typeofproduct.toUpperCase() == 'TRD') {
              this.productTypeSTD = false;
              this.productTypeTRD = true;
              this.costMasterForm.copperindex.setValue(response.data[0].copperindex);
              this.costMasterForm.cubase.setValue(response.data[0].adjustment_fullcu);
              this.costMasterForm.transferprice.setValue(response.data[0].pg);
            }
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.costmasterId = null;
      this.productTypeSTD = true;
      this.productTypeTRD = false;
      this.costMasterForm.articleno.setValue(null);
      this.costMasterForm.description.setValue(null);
      this.costMasterForm.primaryplant.setValue(null);
      this.costMasterForm.currency.setValue('INR');
      this.costMasterForm.standardcost.setValue(null);
      this.costMasterForm.copperweight.setValue(null);
      this.costMasterForm.baseprice.setValue(null);
      this.costMasterForm.copperbasecost.setValue(null);
      this.costMasterForm.otherrmc.setValue(null);
      this.costMasterForm.overhead.setValue(null);
      this.costMasterForm.copperindex.setValue(null);
      this.costMasterForm.cubase.setValue(null);
      this.costMasterForm.transferprice.setValue(null);
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }

  onCostSaveClick() {
    this.submitted = true;

    if (this.CostMasterForm.invalid)
      return;

    let costmastersavemodel = [];

    if (this.productTypeSTD) {
      costmastersavemodel.push({
        articleno: this.costMasterForm.articleno.value,
        primaryplant: this.costMasterForm.primaryplant.value,
        currency: this.costMasterForm.currency.value,
        standardcost: this.costMasterForm.standardcost.value,
        copperweight: this.costMasterForm.copperweight.value,
        copperindex: this.costMasterForm.copperindex.value,
        baseprice: this.costMasterForm.baseprice.value,
        copperbasecost: this.costMasterForm.copperbasecost.value,
        otherrmc: this.costMasterForm.otherrmc.value,
        overhead: this.costMasterForm.overhead.value
      });
    } else if (this.productTypeTRD) {
      costmastersavemodel.push({
        articleno: this.costMasterForm.articleno.value,
        primaryplant: this.costMasterForm.primaryplant.value,
        currency: this.costMasterForm.currency.value,
        standardcost: this.costMasterForm.standardcost.value,
        copperindex: this.costMasterForm.copperindex.value,
        cubase: this.costMasterForm.cubase.value,
        transferprice: this.costMasterForm.value
      });
    }

    let selectedpropducttype = '';
    if (this.productTypeSTD)
      selectedpropducttype = 'STD';
    else if (this.productTypeTRD)
      selectedpropducttype = 'TRD';

    this.rmcostmasterService.savecostmaster(costmastersavemodel, selectedpropducttype).subscribe(
      response => {
        if (response) {
          this.getCount(this.searchValue);
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Cost Master saved successfully.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}