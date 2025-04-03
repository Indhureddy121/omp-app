import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductmasterService } from '@core/services/masters/productmaster.service';
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
import { environment } from 'src/environments/environment';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-productmaster',
  templateUrl: './productmaster.component.html',
  styleUrls: ['./productmaster.component.css']
})
export class ProductmasterComponent implements OnInit {

  ProductMasterForm: FormGroup;
  importmodel: FormGroup;

  closeResult: string;
  fileData: any;
  fileUploaded: any;
  file: any;
  storeData: any;
  worksheet: XLSX.WorkSheet;
  jsonData: any[];
  importData: any[];
  importItemDetail: any[];
  type: string = 'productmaster';
  filename: string;
  isShowDownload: boolean = false;
  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  productmasterlist: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRows: number;
  pager: any = {};
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  deleteConfirmModel = Object();
  productmasterId: number;
  searchModel = Object();
  typeList: any[] = [
    { code: 'STD', description: 'Standard(MFG)' },
    { code: 'TRD', description: 'Trading(TRD)' }];
  UOMList: any[] = [
    { code: 'M', description: 'M' },
    { code: 'PC', description: 'PC' }];
  // IsFixedALPFlag: boolean = false;
  viewOnly: boolean = false;

  constructor(
    private pagerServcie: PagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private filesService: FilesService,
    private productmasterService: ProductmasterService,
    private standarditemService: StandarditemService,
    private notificationService: NotificationService
  ) { }

  get productMasterForm() { return this.ProductMasterForm.controls }

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

    this.ProductMasterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]],
      description: [null, [Validators.required]],
      uom: [null, [Validators.required]],
      industrystdtext: [null],
      labtext: [null],
      hsn: [null],
      productgroup: [null, [Validators.required]],
      ph: [null, [Validators.required]],
      ph2: [null],
      ph6: [null],
      sapid: [null],
      length: [null],
      mdq: [null]
    });
  }

  public getCount() {
    let filtermodel = { searchValue: this.searchValue }
    this.productmasterService.getProductMasterCount(filtermodel).subscribe(
      response => {
        this.totalRows = response.productmastercount[0].count;
        if (this.totalRows > 0)
          this.getData(this.pageSize);
        else
          this.productmasterlist = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.productmasterService.getProductMasterList(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.productmasterlist = response.responsedata.data;
          this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
        }
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

    var table = document.getElementById('table-productmaster');
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
    this.router.navigateByUrl('masters/productmaster/logs');
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
      this.worksheet = workbook.Sheets[workbook.SheetNames[0]];
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
    let data = [];
    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.productmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.productmaster)) {
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

  private saveData(fileresponse: any) {
    this.productmasterService.importporuductmaster(fileresponse).subscribe(
      response => {
        // this.savedResult = response.result;
        // this.isShowDownload = true;
        // let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/productmaster/logs/' + this.savedResult.status_file_name;
        // FileSaver.saveAs(url, this.savedResult.status_file_name);
        // this.notificationService.showSuccess("Imported Successfully");
        this.modalService.dismissAll();
        this.notificationService.showInfo('Importing data is inprogress in background. Please check the status in history after sometime.');
        this.getCount();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public exportfiles(file: any) {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/productmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.productmaster;
    FileSaver.saveAs(url, SampleEnum.productmaster);
  }

  public onExport() {
    let searchObj = "";
    if(this.searchValue)
      searchObj = JSON.stringify({filters:{search:this.searchValue}});

    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: searchObj, sortField: this.sortField, userId: this.authService.getUserId()}
    
    
    this.productmasterService.initiateExportProductMaster(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          console.log("Data : ",response.responsedata);
          //this.notificationService.showSuccess("Product Master export file generated successfully");
          this.notificationService.showInfo("The file export is in process and will be available to download in few minutes");
          this.router.navigateByUrl('masters/productmaster/downloads');
          // this.exportdatalist = response.responsedata.data;
          // let listData = [];

          // if (this.exportdatalist) {
          //   listData = this.exportdatalist;
          //   let data = [];

          //   listData.forEach(element => {
          //     delete element.id;
          //     delete element.pm_lastupdated_by;
          //     delete element.pm_lastupdated_date;
          //   });
          // }

          // let productmasterheader = Config.masterfilesheaders.productmaster;
          // listData = listData.map(item => {
          //   return {
          //     [productmasterheader[0]]: item.articleno,
          //     [productmasterheader[1]]: item.description,
          //     [productmasterheader[2]]: item.uom,
          //     [productmasterheader[3]]: item.industry_std_text,
          //     [productmasterheader[4]]: item.lab_text,
          //     [productmasterheader[5]]: item.hsncode,
          //     [productmasterheader[6]]: item.pg,
          //     [productmasterheader[7]]: item.ph,
          //     [productmasterheader[8]]: item.phtwo,
          //     [productmasterheader[9]]: item.phsix,
          //     [productmasterheader[10]]: item.sapid,
          //     [productmasterheader[11]]: item.length,
          //     [productmasterheader[12]]: item.mdq
          //   };
          // });

          // let fileName = 'Product Master - ' + this.createdDate;

          // this.appService.exportAsExcelFile(listData, fileName);
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
    this.productmasterService.deleteproductmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess('Product Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditProductMasterPopup(id: number) {
    if (id) {
      this.productmasterService.getProductMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.productmasterId = response.data[0].id;
            this.productMasterForm.articleno.setValue(response.data[0].articleno);
            this.productMasterForm.description.setValue(response.data[0].description);
            this.productMasterForm.uom.setValue(response.data[0].uom.toUpperCase());
            if (response.data[0].uom.toUpperCase() != 'PC') {
              this.productMasterForm.length.setValidators(Validators.required);
              this.productMasterForm.length.updateValueAndValidity();
            } else {
              this.productMasterForm.length.clearValidators();
              this.productMasterForm.length.updateValueAndValidity();
            }
            this.productMasterForm.industrystdtext.setValue(response.data[0].industry_std_text);
            this.productMasterForm.labtext.setValue(response.data[0].lab_text);
            this.productMasterForm.hsn.setValue(response.data[0].hsncode);
            this.productMasterForm.productgroup.setValue(response.data[0].pg);
            this.productMasterForm.ph.setValue(response.data[0].ph);
            this.productMasterForm.ph2.setValue(response.data[0].phtwo);
            this.productMasterForm.ph6.setValue(response.data[0].phsix);
            this.productMasterForm.sapid.setValue(response.data[0].sapid);
            this.productMasterForm.length.setValue(response.data[0].length);
            this.productMasterForm.mdq.setValue(response.data[0].mdq);
            // this.IsFixedALPFlag = response.data[0].isfixedalp == 0 ? false : true;
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.productmasterId = null;
      this.productMasterForm.articleno.setValue(null);
      this.productMasterForm.description.setValue(null);
      this.productMasterForm.uom.setValue(null);
      this.productMasterForm.industrystdtext.setValue(null);
      this.productMasterForm.labtext.setValue(null);
      this.productMasterForm.hsn.setValue(null);
      this.productMasterForm.productgroup.setValue(null);
      this.productMasterForm.ph.setValue(null);
      this.productMasterForm.ph2.setValue(null);
      this.productMasterForm.ph6.setValue(null);
      this.productMasterForm.sapid.setValue(null);
      this.productMasterForm.length.setValue(null);
      this.productMasterForm.mdq.setValue(null);
      // this.IsFixedALPFlag = false;
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }

  onProductMasterSaveClick() {
    this.submitted = true;

    if (this.ProductMasterForm.invalid)
      return;

    let productmasterheader = Config.masterfilesheaders.productmaster;
    let productmastersavemodel = [{
      [productmasterheader[0]]: this.productMasterForm.articleno.value,
      [productmasterheader[1]]: this.productMasterForm.description.value,
      [productmasterheader[2]]: this.productMasterForm.uom.value,
      [productmasterheader[3]]: this.productMasterForm.industrystdtext.value,
      [productmasterheader[4]]: this.productMasterForm.labtext.value,
      [productmasterheader[5]]: this.productMasterForm.hsn.value,
      [productmasterheader[6]]: this.productMasterForm.productgroup.value,
      [productmasterheader[7]]: this.productMasterForm.ph.value,
      [productmasterheader[8]]: this.productMasterForm.ph2.value,
      [productmasterheader[9]]: this.productMasterForm.ph6.value,
      [productmasterheader[10]]: this.productMasterForm.sapid.value,
      [productmasterheader[11]]: this.productMasterForm.length.value,
      [productmasterheader[12]]: this.productMasterForm.mdq.value,
      // [productmasterheader[12]]: this.IsFixedALPFlag
    }]

    this.productmasterService.saveproductmaster(productmastersavemodel).subscribe(
      response => {
        this.getCount();
        this.modalService.dismissAll();
        this.notificationService.showSuccess('Product Master saved successfully. It will take 20 minutes to reflect in offer.');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onUOMChange(event: any) {
    if (event) {
      if (event.code == "M") {
        this.productMasterForm.length.setValidators(Validators.required);
        this.productMasterForm.length.updateValueAndValidity();
      } else {
        this.productMasterForm.length.clearValidators();
        this.productMasterForm.length.updateValueAndValidity();
      }
    } else {
      this.productMasterForm.length.clearValidators();
      this.productMasterForm.length.updateValueAndValidity();
    }
  }

  getDownload() {
    this.router.navigateByUrl('masters/productmaster/downloads');
  }

  // onIsFixedALPChange(event: any) {
  //   if (event)
  //     this.IsFixedALPFlag = event.target.checked;
  //   else
  //     this.IsFixedALPFlag = false;
  // }
}